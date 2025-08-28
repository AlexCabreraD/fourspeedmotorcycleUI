
import { createWPSClient, WPSApiClient, WPSItem, WPSProduct, WPSTaxonomyterm } from './wps-client'

export interface CategoryNode extends WPSTaxonomyterm {
  children?: CategoryNode[]
  itemCount?: number
  items?: WPSItem[]
  filteredItems?: WPSItem[]
  level?: number
}

export interface TaxonomyStructure {
  rootCategory: CategoryNode
  mainCategories: CategoryNode[]
  categoryMap: Map<number, CategoryNode>
}

export interface ProductTypeFilter {
  productType: string
  items: WPSItem[]
}

export class TaxonomyNavigationService {
  private client: WPSApiClient
  private cachedStructure: TaxonomyStructure | null = null

  constructor(client?: WPSApiClient) {
    this.client = client || createWPSClient()
  }

  async getTaxonomyStructure(): Promise<TaxonomyStructure> {
    if (this.cachedStructure) {
      return this.cachedStructure
    }

    try {
      const response = await this.client.getTaxonomyterms({
        'filter[vocabulary_id]': 15,
        'page[size]': 200, // Get all categories
        'sort[asc]': 'left',
      })

      const allTerms = response.data

      const structure = this.buildTaxonomyTree(allTerms)

      this.cachedStructure = structure

      return structure
    } catch (error) {
      console.error('Error loading taxonomy structure:', error)
      throw error
    }
  }

  async getMainCategories(): Promise<CategoryNode[]> {
    const structure = await this.getTaxonomyStructure()
    return structure.mainCategories
  }

  async getCategoryWithItems(
    categoryId: number,
    includeItems: boolean = true
  ): Promise<CategoryNode | null> {
    const structure = await this.getTaxonomyStructure()
    const category = structure.categoryMap.get(categoryId)

    if (!category) {
      return null
    }

    if (includeItems && !category.items) {
      await this.loadCategoryItems(category)
    }

    return category
  }

  async getFilteredItems(
    categoryId: number,
    productType?: string
  ): Promise<{
    category: CategoryNode
    items: WPSItem[]
    totalCount: number
    hasMore: boolean
    nextCursor?: string
  }> {
    try {
      const category = await this.getCategoryWithItems(categoryId, false)

      if (!category) {
        throw new Error(`Category ${categoryId} not found`)
      }

      const params: any = {
        'page[size]': 50,
        include: 'product',
      }

      if (productType) {
        params['filter[product_type]'] = productType
      }

      const response = await this.client.get<WPSItem[]>(`taxonomyterms/${categoryId}/items`, params)

      return {
        category,
        items: response.data,
        totalCount: response.data.length,
        hasMore: !!response.meta?.cursor?.next,
        nextCursor: response.meta?.cursor?.next,
      }
    } catch (error) {
      console.error('Error getting filtered items:', error)
      throw error
    }
  }

  async getProductTypesInCategory(categoryId: number): Promise<ProductTypeFilter[]> {
    try {
      const response = await this.client.get<WPSItem[]>(`taxonomyterms/${categoryId}/items`, {
        'fields[items]': 'product_type',
        'page[size]': 100,
      })

      const typeMap = new Map<string, WPSItem[]>()

      response.data.forEach((responseItem: WPSItem) => {
        if (responseItem.product_type) {
          if (!typeMap.has(responseItem.product_type)) {
            typeMap.set(responseItem.product_type, [])
          }
          typeMap.get(responseItem.product_type)!.push(responseItem)
        }
      })

      return Array.from(typeMap.entries()).map(([productType, items]) => ({
        productType,
        items,
      }))
    } catch (error) {
      console.error('Error getting product types:', error)
      return []
    }
  }

  async getCategoryBreadcrumb(categoryId: number): Promise<CategoryNode[]> {
    const structure = await this.getTaxonomyStructure()
    const category = structure.categoryMap.get(categoryId)

    if (!category) {
      return []
    }

    const breadcrumb: CategoryNode[] = []
    let current: CategoryNode | undefined = category

    while (current) {
      breadcrumb.unshift(current)

      if (current.parent_id) {
        current = structure.categoryMap.get(current.parent_id)
      } else {
        break
      }
    }

    return breadcrumb
  }

  async searchInCategory(
    categoryId: number,
    query: string
  ): Promise<{
    items: WPSItem[]
    products: WPSProduct[]
  }> {
    try {
      const itemsResponse = await this.client.get<WPSItem[]>(`taxonomyterms/${categoryId}/items`, {
        'filter[name][pre]': query,
        'page[size]': 20,
        include: 'product',
      })

      const productsResponse = await this.client.get<WPSProduct[]>(
        `taxonomyterms/${categoryId}/products`,
        {
          'filter[name][pre]': query,
          'page[size]': 20,
          include: 'items',
        }
      )

      return {
        items: itemsResponse.data,
        products: productsResponse.data,
      }
    } catch (error) {
      console.error('Error searching in category:', error)
      return { items: [], products: [] }
    }
  }


  private buildTaxonomyTree(terms: WPSTaxonomyterm[]): TaxonomyStructure {
    const categoryMap = new Map<number, CategoryNode>()

    terms.forEach((term) => {
      categoryMap.set(term.id, {
        ...term,
        children: [],
        level: term.depth,
        itemCount: 0,
      })
    })

    const rootCategory = terms.find((t) => t.depth === 0 && t.vocabulary_id === 15)

    if (!rootCategory) {
      throw new Error('Root category (Catalog Classification) not found')
    }

    terms.forEach((term) => {
      if (term.parent_id) {
        const parent = categoryMap.get(term.parent_id)
        const child = categoryMap.get(term.id)

        if (parent && child) {
          parent.children = parent.children || []
          parent.children.push(child)
        }
      }
    })

    const mainCategories = terms
      .filter((t) => t.parent_id === rootCategory.id && t.depth === 1)
      .map((t) => categoryMap.get(t.id)!)
      .filter(Boolean)
      .sort((a, b) => a.left - b.left)

    return {
      rootCategory: categoryMap.get(rootCategory.id)!,
      mainCategories,
      categoryMap,
    }
  }

  private async loadCategoryItems(category: CategoryNode): Promise<void> {
    try {
      const response = await this.client.get<WPSItem[]>(`taxonomyterms/${category.id}/items`, {
        'page[size]': 100,
        include: 'product',
      })

      category.items = response.data
      category.itemCount = response.data.length
    } catch (error) {
      console.error(`Error loading items for category ${category.id}:`, error)
      category.items = []
      category.itemCount = 0
    }
  }

  clearCache(): void {
    this.cachedStructure = null
  }
}


export function useTaxonomyNavigation() {
  const service = new TaxonomyNavigationService()

  return {
    async getMainCategories() {
      return service.getMainCategories()
    },

    async getCategoryWithItems(categoryId: number) {
      return service.getCategoryWithItems(categoryId)
    },

    async getFilteredItems(categoryId: number, productType?: string) {
      return service.getFilteredItems(categoryId, productType)
    },

    async getProductTypes(categoryId: number) {
      return service.getProductTypesInCategory(categoryId)
    },

    async getBreadcrumb(categoryId: number) {
      return service.getCategoryBreadcrumb(categoryId)
    },

    async searchInCategory(categoryId: number, query: string) {
      return service.searchInCategory(categoryId, query)
    },
  }
}

export const TaxonomyNavigationExample = {
  description: 'Example React component usage for taxonomy navigation',
  example: `
import { useTaxonomyNavigation } from '@/lib/api/taxonomy-service';

function CategoryNavigation() {
    const [mainCategories, setMainCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    
    const taxonomy = useTaxonomyNavigation();

    useEffect(() => {
        taxonomy.getMainCategories().then(setMainCategories);
    }, []);

    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        
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
  `,
}

export default TaxonomyNavigationService
