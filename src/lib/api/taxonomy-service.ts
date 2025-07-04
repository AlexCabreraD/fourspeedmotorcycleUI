// lib/api/taxonomy-service.ts
// Service for handling the hierarchical taxonomy structure shown in your diagram

import { WPSApiClient, createWPSClient, WPSTaxonomyterm, WPSItem, WPSProduct } from './wps-client';

// Enhanced interfaces based on your diagram structure
export interface CategoryNode extends WPSTaxonomyterm {
    children?: CategoryNode[];
    itemCount?: number;
    items?: WPSItem[];
    filteredItems?: WPSItem[];
    level?: number; // 0 = root (Catalog Classification), 1 = main categories, 2+ = subcategories
}

export interface TaxonomyStructure {
    rootCategory: CategoryNode; // Vocabulary ID 15 - Catalog Classification
    mainCategories: CategoryNode[]; // Apparel, ATV, Bicycle, etc.
    categoryMap: Map<number, CategoryNode>; // Quick lookup by ID
}

export interface ProductTypeFilter {
    productType: string; // e.g., "suspension"
    items: WPSItem[];
}

export class TaxonomyNavigationService {
    private client: WPSApiClient;
    private cachedStructure: TaxonomyStructure | null = null;

    constructor(client?: WPSApiClient) {
        this.client = client || createWPSClient();
    }

    // Get the complete taxonomy structure as shown in your diagram
    async getTaxonomyStructure(): Promise<TaxonomyStructure> {
        if (this.cachedStructure) {
            return this.cachedStructure;
        }

        try {
            // Get all taxonomy terms for vocabulary 15 (Catalog Classification)
            const response = await this.client.getTaxonomyterms({
                'filter[vocabulary_id]': 15,
                'page[size]': 200, // Get all categories
                'sort[asc]': 'left' // Sort by tree order
            });

            const allTerms = response.data;
            console.log('Found taxonomy terms:', allTerms.length);

            // Build the hierarchical structure
            const structure = this.buildTaxonomyTree(allTerms);

            // Cache the structure
            this.cachedStructure = structure;

            return structure;
        } catch (error) {
            console.error('Error loading taxonomy structure:', error);
            throw error;
        }
    }

    // Get main categories (Apparel, ATV, Bicycle, Offroad, Snow, Street, Watercraft)
    async getMainCategories(): Promise<CategoryNode[]> {
        const structure = await this.getTaxonomyStructure();
        return structure.mainCategories;
    }

    // Get a specific category by ID with its children and items
    async getCategoryWithItems(categoryId: number, includeItems: boolean = true): Promise<CategoryNode | null> {
        const structure = await this.getTaxonomyStructure();
        const category = structure.categoryMap.get(categoryId);

        if (!category) {
            return null;
        }

        if (includeItems && !category.items) {
            // Load items for this category
            await this.loadCategoryItems(category);
        }

        return category;
    }

    // Get items filtered by category and product type (as shown in your diagram)
    async getFilteredItems(categoryId: number, productType?: string): Promise<{
        category: CategoryNode;
        items: WPSItem[];
        totalCount: number;
        hasMore: boolean;
        nextCursor?: string;
    }> {
        try {
            const category = await this.getCategoryWithItems(categoryId, false);

            if (!category) {
                throw new Error(`Category ${categoryId} not found`);
            }

            // Build filter parameters
            const params: any = {
                'page[size]': 50,
                include: 'product'
            };

            // Filter by product type if specified (e.g., "suspension")
            if (productType) {
                params['filter[product_type]'] = productType;
            }

            // Get items through the taxonomy relationship
            const response = await this.client.get<WPSItem[]>(`taxonomyterms/${categoryId}/items`, params);

            return {
                category,
                items: response.data,
                totalCount: response.data.length,
                hasMore: !!response.meta?.cursor?.next,
                nextCursor: response.meta?.cursor?.next
            };

        } catch (error) {
            console.error('Error getting filtered items:', error);
            throw error;
        }
    }

    // Get product types available in a category (for the filter dropdown)
    async getProductTypesInCategory(categoryId: number): Promise<ProductTypeFilter[]> {
        try {
            // Get all items in the category
            const response = await this.client.get<WPSItem[]>(`taxonomyterms/${categoryId}/items`, {
                'fields[items]': 'product_type',
                'page[size]': 100
            });

            // Group by product_type
            const typeMap = new Map<string, WPSItem[]>();

            response.data.forEach((responseItem: WPSItem) => {
                if (responseItem.product_type) {
                    if (!typeMap.has(responseItem.product_type)) {
                        typeMap.set(responseItem.product_type, []);
                    }
                    typeMap.get(responseItem.product_type)!.push(responseItem);
                }
            });

            // Convert to array
            return Array.from(typeMap.entries()).map(([productType, items]) => ({
                productType,
                items
            }));

        } catch (error) {
            console.error('Error getting product types:', error);
            return [];
        }
    }

    // Navigate the breadcrumb path for a category
    async getCategoryBreadcrumb(categoryId: number): Promise<CategoryNode[]> {
        const structure = await this.getTaxonomyStructure();
        const category = structure.categoryMap.get(categoryId);

        if (!category) {
            return [];
        }

        const breadcrumb: CategoryNode[] = [];
        let current: CategoryNode | undefined = category;

        // Walk up the tree to build breadcrumb
        while (current) {
            breadcrumb.unshift(current);

            if (current.parent_id) {
                current = structure.categoryMap.get(current.parent_id);
            } else {
                break;
            }
        }

        return breadcrumb;
    }

    // Search within a specific category
    async searchInCategory(categoryId: number, query: string): Promise<{
        items: WPSItem[];
        products: WPSProduct[];
    }> {
        try {
            // Search items within the category
            const itemsResponse = await this.client.get<WPSItem[]>(`taxonomyterms/${categoryId}/items`, {
                'filter[name][pre]': query,
                'page[size]': 20,
                include: 'product'
            });

            // Search products within the category
            const productsResponse = await this.client.get<WPSProduct[]>(`taxonomyterms/${categoryId}/products`, {
                'filter[name][pre]': query,
                'page[size]': 20,
                include: 'items'
            });

            return {
                items: itemsResponse.data,
                products: productsResponse.data
            };

        } catch (error) {
            console.error('Error searching in category:', error);
            return { items: [], products: [] };
        }
    }

    // Private helper methods

    private buildTaxonomyTree(terms: WPSTaxonomyterm[]): TaxonomyStructure {
        // Create enhanced category nodes
        const categoryMap = new Map<number, CategoryNode>();

        terms.forEach(term => {
            categoryMap.set(term.id, {
                ...term,
                children: [],
                level: term.depth,
                itemCount: 0
            });
        });

        // Find root (Catalog Classification - should be depth 0)
        const rootCategory = terms.find(t => t.depth === 0 && t.vocabulary_id === 15);

        if (!rootCategory) {
            throw new Error('Root category (Catalog Classification) not found');
        }

        // Build parent-child relationships
        terms.forEach(term => {
            if (term.parent_id) {
                const parent = categoryMap.get(term.parent_id);
                const child = categoryMap.get(term.id);

                if (parent && child) {
                    parent.children = parent.children || [];
                    parent.children.push(child);
                }
            }
        });

        // Get main categories (children of root, should be depth 1)
        const mainCategories = terms
            .filter(t => t.parent_id === rootCategory.id && t.depth === 1)
            .map(t => categoryMap.get(t.id)!)
            .filter(Boolean)
            .sort((a, b) => a.left - b.left);

        return {
            rootCategory: categoryMap.get(rootCategory.id)!,
            mainCategories,
            categoryMap
        };
    }

    private async loadCategoryItems(category: CategoryNode): Promise<void> {
        try {
            const response = await this.client.get<WPSItem[]>(`taxonomyterms/${category.id}/items`, {
                'page[size]': 100,
                include: 'product'
            });

            category.items = response.data;
            category.itemCount = response.data.length;

        } catch (error) {
            console.error(`Error loading items for category ${category.id}:`, error);
            category.items = [];
            category.itemCount = 0;
        }
    }

    // Clear cache (useful for refreshing data)
    clearCache(): void {
        this.cachedStructure = null;
    }
}

// React hooks for easy integration

export function useTaxonomyNavigation() {
    const service = new TaxonomyNavigationService();

    return {
        // Get the main categories for navigation
        async getMainCategories() {
            return service.getMainCategories();
        },

        // Get category details with items
        async getCategoryWithItems(categoryId: number) {
            return service.getCategoryWithItems(categoryId);
        },

        // Get filtered items (like your diagram shows)
        async getFilteredItems(categoryId: number, productType?: string) {
            return service.getFilteredItems(categoryId, productType);
        },

        // Get available product types for filters
        async getProductTypes(categoryId: number) {
            return service.getProductTypesInCategory(categoryId);
        },

        // Get breadcrumb navigation
        async getBreadcrumb(categoryId: number) {
            return service.getCategoryBreadcrumb(categoryId);
        },

        // Search within category
        async searchInCategory(categoryId: number, query: string) {
            return service.searchInCategory(categoryId, query);
        }
    };
}

// Example usage documentation
export const TaxonomyNavigationExample = {
  description: 'Example React component usage for taxonomy navigation',
  example: `
// Example React component usage

import { useTaxonomyNavigation } from '@/lib/api/taxonomy-service';

function CategoryNavigation() {
    const [mainCategories, setMainCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    
    const taxonomy = useTaxonomyNavigation();

    useEffect(() => {
        // Load main categories (Apparel, ATV, Bicycle, etc.)
        taxonomy.getMainCategories().then(setMainCategories);
    }, []);

    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        
        // Load category items and available product types
        const [categoryData, types] = await Promise.all([
            taxonomy.getFilteredItems(categoryId),
            taxonomy.getProductTypes(categoryId)
        ]);
        
        setItems(categoryData.items);
        setProductTypes(types);
    };

    return (
        <div>
            {/* Component implementation */}
        </div>
    );
}
  `
};

export default TaxonomyNavigationService;