// src/app/api-test/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2, Eye, EyeOff, Search, RefreshCw } from 'lucide-react';

// Import your API client
import { createWPSClient, WPSApiClient, ImageUtils } from '@/lib/api/wps-client';
import { getWPSApiService } from '@/lib/api/services';

interface TestResult {
    name: string;
    endpoint: string;
    status: 'pending' | 'success' | 'error' | 'skipped';
    duration?: number;
    error?: string;
    data?: any;
    count?: number;
}

interface TestSuite {
    name: string;
    tests: TestResult[];
    status: 'pending' | 'running' | 'completed';
}

export default function ApiTestPage() {
    const [client, setClient] = useState<WPSApiClient | null>(null);
    const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [config, setConfig] = useState({
        baseUrl: '',
        token: '',
        timeout: 30000
    });
    const [envStatus, setEnvStatus] = useState({
        baseUrl: { found: false, source: '', value: '' },
        token: { found: false, source: '', value: '' },
        checked: false
    });

    // Check environment variables on component mount
    useEffect(() => {
        const checkEnvVariables = () => {
            // Check for API URL
            let baseUrl = '';
            let baseUrlSource = '';
            let baseUrlFound = false;

            if (process.env.NEXT_PUBLIC_WPS_API_URL) {
                baseUrl = process.env.NEXT_PUBLIC_WPS_API_URL;
                baseUrlSource = 'NEXT_PUBLIC_WPS_API_URL';
                baseUrlFound = true;
            } else if (process.env.WPS_API_URL) {
                baseUrl = process.env.WPS_API_URL;
                baseUrlSource = 'WPS_API_URL';
                baseUrlFound = true;
            }

            // Check for API Token
            let token = '';
            let tokenSource = '';
            let tokenFound = false;

            if (process.env.NEXT_PUBLIC_WPS_API_TOKEN) {
                token = process.env.NEXT_PUBLIC_WPS_API_TOKEN;
                tokenSource = 'NEXT_PUBLIC_WPS_API_TOKEN';
                tokenFound = true;
            } else if (process.env.WPS_API_TOKEN) {
                token = process.env.WPS_API_TOKEN;
                tokenSource = 'WPS_API_TOKEN';
                tokenFound = true;
            }

            // Update state
            setConfig(prev => ({
                ...prev,
                baseUrl: baseUrl,
                token: token
            }));

            setEnvStatus({
                baseUrl: {
                    found: baseUrlFound,
                    source: baseUrlSource,
                    value: baseUrl ? `${baseUrl.substring(0, 20)}...` : ''
                },
                token: {
                    found: tokenFound,
                    source: tokenSource,
                    value: token ? `${token.substring(0, 8)}...` : ''
                },
                checked: true
            });
        };

        checkEnvVariables();
    }, []);

    // Initialize test suites
    useEffect(() => {
        const suites: TestSuite[] = [
            {
                name: 'Environment Configuration',
                status: 'pending',
                tests: [
                    { name: 'Check Environment Variables', endpoint: 'Environment Check', status: 'pending' },
                    { name: 'Validate API URL Format', endpoint: 'URL Validation', status: 'pending' },
                    { name: 'Validate Token Format', endpoint: 'Token Validation', status: 'pending' }
                ]
            },
            {
                name: 'Authentication & Basic Connection',
                status: 'pending',
                tests: [
                    { name: 'Client Initialization', endpoint: 'N/A', status: 'pending' },
                    { name: 'Basic API Connection', endpoint: '/brands?page[size]=1', status: 'pending' },
                    { name: 'Token Authentication', endpoint: '/items?page[size]=1', status: 'pending' }
                ]
            },
            {
                name: 'Core Product Data',
                status: 'pending',
                tests: [
                    { name: 'Get Products', endpoint: '/products?page[size]=5', status: 'pending' },
                    { name: 'Get Single Product', endpoint: '/products/6', status: 'pending' },
                    { name: 'Get Product with Items', endpoint: '/products/6?include=items', status: 'pending' },
                    { name: 'Get Items', endpoint: '/items?page[size]=5', status: 'pending' },
                    { name: 'Get Single Item', endpoint: '/items/387', status: 'pending' },
                    { name: 'Get Item by SKU (Crutch)', endpoint: '/items/crutch/015-01001', status: 'pending' }
                ]
            },
            {
                name: 'Brands & Categories',
                status: 'pending',
                tests: [
                    { name: 'Get Brands', endpoint: '/brands?page[size]=10', status: 'pending' },
                    { name: 'Get Brand by ID', endpoint: '/brands/135', status: 'pending' },
                    { name: 'Get Taxonomy Terms', endpoint: '/taxonomyterms?page[size]=10', status: 'pending' },
                    { name: 'Get Category Products', endpoint: '/taxonomyterms/197/products?page[size]=5', status: 'pending' }
                ]
            },
            {
                name: 'Images & Media',
                status: 'pending',
                tests: [
                    { name: 'Get Images', endpoint: '/images?page[size]=5', status: 'pending' },
                    { name: 'Get Product Images', endpoint: '/products/6/images', status: 'pending' },
                    { name: 'Test Image URL Building', endpoint: 'N/A (Client Function)', status: 'pending' }
                ]
            },
            {
                name: 'Inventory & Pricing',
                status: 'pending',
                tests: [
                    { name: 'Get Inventory', endpoint: '/inventory?page[size]=5', status: 'pending' },
                    { name: 'Get Item Inventory', endpoint: '/inventory?filter[item_id]=216584', status: 'pending' },
                    { name: 'Get Item with Inventory', endpoint: '/items/387?include=inventory', status: 'pending' }
                ]
            },
            {
                name: 'Search & Filtering',
                status: 'pending',
                tests: [
                    { name: 'Search Products by Name', endpoint: '/products?filter[name][pre]=Multirate', status: 'pending' },
                    { name: 'Search Items by SKU', endpoint: '/items?filter[sku][pre]=015-', status: 'pending' },
                    { name: 'Filter by Brand', endpoint: '/items?filter[brand_id]=135&page[size]=5', status: 'pending' },
                    { name: 'Filter by Price Range', endpoint: '/items?filter[list_price][gt]=50&filter[list_price][lt]=200&page[size]=5', status: 'pending' }
                ]
            },
            {
                name: 'Advanced Features',
                status: 'pending',
                tests: [
                    { name: 'Complex Include Query', endpoint: '/products?include=items,images,features&page[size]=3', status: 'pending' },
                    { name: 'Sorting Test', endpoint: '/items?sort[desc]=list_price&page[size]=5', status: 'pending' },
                    { name: 'Field Selection', endpoint: '/items?fields[items]=sku,name,list_price&page[size]=5', status: 'pending' },
                    { name: 'Count Only Query', endpoint: '/items?countOnly=true', status: 'pending' }
                ]
            },
            {
                name: 'Service Layer Tests',
                status: 'pending',
                tests: [
                    { name: 'Enhanced Products', endpoint: 'Service: getEnhancedProducts', status: 'pending' },
                    { name: 'Enhanced Product by ID', endpoint: 'Service: getEnhancedProduct', status: 'pending' },
                    { name: 'Search Products Service', endpoint: 'Service: searchProducts', status: 'pending' },
                    { name: 'Get Categories', endpoint: 'Service: getCategories', status: 'pending' }
                ]
            }
        ];

        setTestSuites(suites);
    }, []);

    // Initialize WPS client
    const initializeClient = () => {
        try {
            const wpsClient = createWPSClient({
                baseUrl: config.baseUrl || undefined,
                token: config.token || undefined,
                timeout: config.timeout
            });
            setClient(wpsClient);
            return wpsClient;
        } catch (error) {
            console.error('Failed to initialize client:', error);
            return null;
        }
    };

    // Update test result
    const updateTestResult = (suiteIndex: number, testIndex: number, update: Partial<TestResult>) => {
        setTestSuites(prev => {
            const newSuites = [...prev];
            newSuites[suiteIndex].tests[testIndex] = {
                ...newSuites[suiteIndex].tests[testIndex],
                ...update
            };
            return newSuites;
        });
    };

    // Run individual test
    const runTest = async (suiteIndex: number, testIndex: number, testClient: WPSApiClient): Promise<void> => {
        const test = testSuites[suiteIndex].tests[testIndex];
        const startTime = Date.now();

        updateTestResult(suiteIndex, testIndex, { status: 'pending' });

        try {
            let result: any;

            // Handle special test cases
            if (test.name === 'Check Environment Variables') {
                const baseUrlFound = envStatus.baseUrl.found;
                const tokenFound = envStatus.token.found;

                if (baseUrlFound && tokenFound) {
                    result = {
                        success: true,
                        message: 'Environment variables found',
                        details: {
                            baseUrl: `Found: ${envStatus.baseUrl.source}`,
                            token: `Found: ${envStatus.token.source}`
                        }
                    };
                } else {
                    const missing = [];
                    if (!baseUrlFound) missing.push('API URL');
                    if (!tokenFound) missing.push('API Token');
                    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
                }
            } else if (test.name === 'Validate API URL Format') {
                const url = config.baseUrl;
                if (!url) {
                    throw new Error('No API URL configured');
                }

                try {
                    new URL(url);
                    if (!url.startsWith('http')) {
                        throw new Error('URL must start with http:// or https://');
                    }
                    result = {
                        success: true,
                        message: 'Valid API URL format',
                        url: url
                    };
                } catch (error: any) {
                    throw new Error(`Invalid URL format: ${error.message}`);
                }
            } else if (test.name === 'Validate Token Format') {
                const token = config.token;
                if (!token) {
                    throw new Error('No API token configured');
                }

                if (token.length < 10) {
                    throw new Error('Token appears too short (likely invalid)');
                }

                result = {
                    success: true,
                    message: 'Token format appears valid',
                    tokenLength: token.length,
                    preview: `${token.substring(0, 8)}...`
                };
            } else if (test.name === 'Client Initialization') {
                if (testClient) {
                    result = { success: true, message: 'Client initialized successfully' };
                } else {
                    throw new Error('Failed to initialize client');
                }
            } else if (test.name === 'Test Image URL Building') {
                // Test image URL building
                const mockImage = {
                    id: 1,
                    domain: 'cdn.wpsstatic.com/',
                    path: 'images/',
                    filename: 'test-image.jpg',
                    alt: null,
                    mime: 'image/jpeg',
                    width: 1000,
                    height: 1000,
                    size: 100000,
                    signature: 'test',
                    created_at: '2025-01-01',
                    updated_at: '2025-01-01'
                };

                const thumbnailUrl = ImageUtils.buildImageUrl(mockImage, '200_max');
                const fullUrl = ImageUtils.buildImageUrl(mockImage, 'full');

                result = {
                    thumbnail: thumbnailUrl,
                    full: fullUrl,
                    isValid: thumbnailUrl.includes('200_max') && fullUrl.includes('full')
                };
            } else if (test.endpoint.startsWith('Service:')) {
                // Test service layer methods
                const serviceName = test.endpoint.replace('Service: ', '');

                switch (serviceName) {
                    case 'getEnhancedProducts':
                        console.log('Testing getEnhancedProducts service...');
                        try {
                            // Try with minimal parameters first
                            result = await getWPSApiService().getEnhancedProducts({ 'page[size]': 3 });
                        } catch (error: any) {
                            console.error('getEnhancedProducts failed, trying direct client call:', error);
                            // Fallback: try direct client call to diagnose
                            const directResult = await testClient.getProducts({ 'page[size]': 3 });
                            throw new Error(`Service failed but direct client worked. Service error: ${error.message}`);
                        }
                        break;
                    case 'getEnhancedProduct':
                        console.log('Testing getEnhancedProduct service...');
                        try {
                            result = await getWPSApiService().getEnhancedProduct(207997);
                        } catch (error: any) {
                            console.error('getEnhancedProduct failed, trying direct client call:', error);
                            // Fallback: try direct client call
                            const directResult = await testClient.getProduct(207997);
                            throw new Error(`Service failed but direct client worked. Service error: ${error.message}`);
                        }
                        break;
                    case 'searchProducts':
                        console.log('Testing searchProducts service...');
                        try {
                            result = await getWPSApiService().searchProducts('Multirate', { pageSize: 3 });
                        } catch (error: any) {
                            console.error('searchProducts failed:', error);
                            throw error;
                        }
                        break;
                    case 'getCategories':
                        console.log('Testing getCategories service...');
                        try {
                            result = await getWPSApiService().getCategories();
                        } catch (error: any) {
                            console.error('getCategories failed:', error);
                            throw error;
                        }
                        break;
                    default:
                        throw new Error(`Unknown service method: ${serviceName}`);
                }
            } else {
                // Regular API endpoint test
                const endpoint = test.endpoint.split('?')[0];
                const params: any = {};

                // Parse query parameters
                if (test.endpoint.includes('?')) {
                    const queryString = test.endpoint.split('?')[1];
                    const urlParams = new URLSearchParams(queryString);

                    for (const [key, value] of urlParams) {
                        // Handle nested parameters like page[size]
                        if (key.includes('[') && key.includes(']')) {
                            params[key] = isNaN(Number(value)) ? value : Number(value);
                        } else {
                            params[key] = isNaN(Number(value)) ? value : Number(value);
                        }
                    }
                }

                result = await testClient.get(endpoint, params);
            }

            const duration = Date.now() - startTime;
            const count = Array.isArray(result?.data) ? result.data.length : result?.length || 1;

            updateTestResult(suiteIndex, testIndex, {
                status: 'success',
                duration,
                data: result,
                count
            });

        } catch (error: any) {
            const duration = Date.now() - startTime;
            updateTestResult(suiteIndex, testIndex, {
                status: 'error',
                duration,
                error: error.message || 'Unknown error occurred'
            });
        }
    };

    // Run all tests
    const runAllTests = async () => {
        if (!envStatus.checked) {
            alert('Environment variables are still being checked. Please wait a moment and try again.');
            return;
        }

        if (!config.baseUrl || !config.token) {
            alert('Missing required environment variables. Please check your .env.local file and restart the development server.');
            return;
        }

        setIsRunning(true);
        const testClient = initializeClient();

        if (!testClient) {
            alert('Failed to initialize API client. Check your configuration.');
            setIsRunning(false);
            return;
        }

        // Update all suites to running
        setTestSuites(prev => prev.map(suite => ({ ...suite, status: 'running' })));

        for (let suiteIndex = 0; suiteIndex < testSuites.length; suiteIndex++) {
            const suite = testSuites[suiteIndex];

            for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
                await runTest(suiteIndex, testIndex, testClient);

                // Small delay between tests to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Mark all suites as completed
        setTestSuites(prev => prev.map(suite => ({ ...suite, status: 'completed' })));
        setIsRunning(false);
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'pending':
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
            default:
                return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
        }
    };

    // Get suite summary
    const getSuiteSummary = (suite: TestSuite) => {
        const total = suite.tests.length;
        const passed = suite.tests.filter(t => t.status === 'success').length;
        const failed = suite.tests.filter(t => t.status === 'error').length;
        const pending = suite.tests.filter(t => t.status === 'pending').length;

        return { total, passed, failed, pending };
    };

    // Toggle result visibility
    const toggleResults = (testKey: string) => {
        setShowResults(prev => ({
            ...prev,
            [testKey]: !prev[testKey]
        }));
    };

    // Filter tests based on search
    const filteredSuites = testSuites.map(suite => ({
        ...suite,
        tests: suite.tests.filter(test =>
            test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(suite => suite.tests.length > 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        4SpeedMotorcycle - WPS API Test Suite
                    </h1>
                    <p className="text-gray-600">
                        Comprehensive testing of all WPS API endpoints and functionality
                    </p>
                </div>

                {/* Environment Status Indicator */}
                {envStatus.checked && (
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Environment Variables Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* API URL Status */}
                                <div className="flex items-center gap-3">
                                    {envStatus.baseUrl.found ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">API URL</div>
                                        <div className="text-xs text-gray-500">
                                            {envStatus.baseUrl.found ? (
                                                <>
                                                    Found: <code className="bg-gray-100 px-1 rounded">{envStatus.baseUrl.source}</code>
                                                    <br />
                                                    Value: <span className="text-blue-600">{envStatus.baseUrl.value}</span>
                                                </>
                                            ) : (
                                                <span className="text-red-600">Missing: WPS_API_URL or NEXT_PUBLIC_WPS_API_URL</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* API Token Status */}
                                <div className="flex items-center gap-3">
                                    {envStatus.token.found ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">API Token</div>
                                        <div className="text-xs text-gray-500">
                                            {envStatus.token.found ? (
                                                <>
                                                    Found: <code className="bg-gray-100 px-1 rounded">{envStatus.token.source}</code>
                                                    <br />
                                                    Value: <span className="text-blue-600 font-mono">{envStatus.token.value}</span>
                                                </>
                                            ) : (
                                                <span className="text-red-600">Missing: WPS_API_TOKEN or NEXT_PUBLIC_WPS_API_TOKEN</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Status */}
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                {envStatus.baseUrl.found && envStatus.token.found ? (
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Ready to test API</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-700">
                                        <XCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                      Missing environment variables. Create .env.local with your WPS API credentials.
                    </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Setup Instructions - Show only if environment variables are missing */}
                {envStatus.checked && (!envStatus.baseUrl.found || !envStatus.token.found) && (
                    <div className="mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                                        Environment Setup Required
                                    </h3>
                                    <p className="text-yellow-700 mb-4">
                                        To use the WPS API, you need to configure your environment variables. Follow these steps:
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-2">1. Create .env.local file</h4>
                                            <p className="text-sm text-yellow-700 mb-2">
                                                In your project root directory, create a file named <code className="bg-yellow-100 px-1 rounded">.env.local</code>
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-2">2. Add your WPS API credentials</h4>
                                            <pre className="bg-gray-900 text-green-400 p-3 rounded-md text-sm overflow-x-auto">
{`# .env.local
WPS_API_URL=https://api.wps-inc.com
WPS_API_TOKEN=your_actual_api_token_here

# For client-side access (if needed)
NEXT_PUBLIC_WPS_API_URL=https://api.wps-inc.com
NEXT_PUBLIC_WPS_API_TOKEN=your_actual_api_token_here`}
                      </pre>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-2">3. Get your API token</h4>
                                            <p className="text-sm text-yellow-700">
                                                Log into <a href="https://wpsorders.com" target="_blank" rel="noopener noreferrer" className="underline text-yellow-600 hover:text-yellow-500">WPSorders.com</a>,
                                                go to Data Depot → API Sign Up to request your API token.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-2">4. Restart your development server</h4>
                                            <p className="text-sm text-yellow-700">
                                                After creating the .env.local file, restart your development server:
                                            </p>
                                            <pre className="bg-gray-900 text-green-400 p-2 rounded text-sm mt-1">
npm run dev
                      </pre>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-yellow-100 rounded-md">
                                        <p className="text-xs text-yellow-600">
                                            <strong>Note:</strong> Never commit your .env.local file to version control.
                                            It contains sensitive API credentials.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Configuration Override */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        API Configuration
                        {envStatus.baseUrl.found && envStatus.token.found && (
                            <span className="ml-2 text-sm font-normal text-green-600">(Auto-loaded from environment)</span>
                        )}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Base URL
                            </label>
                            <input
                                type="text"
                                value={config.baseUrl}
                                onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                                placeholder="https://api.wps-inc.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Token
                            </label>
                            <input
                                type="password"
                                value={config.token}
                                onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
                                placeholder="Your API token"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={runAllTests}
                            disabled={isRunning || !envStatus.checked || !config.baseUrl || !config.token}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Running Tests...
                                </>
                            ) : !envStatus.checked ? (
                                <>
                                    <AlertCircle className="w-4 h-4" />
                                    Checking Environment...
                                </>
                            ) : !config.baseUrl || !config.token ? (
                                <>
                                    <XCircle className="w-4 h-4" />
                                    Missing Configuration
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Run All Tests
                                </>
                            )}
                        </button>
                        <div className="text-sm text-gray-600">
                            Environment: {process.env.NODE_ENV || 'development'}
                            {envStatus.checked && (
                                <span className="ml-2">
                  | Config: {envStatus.baseUrl.found && envStatus.token.found ? '✅ Ready' : '❌ Incomplete'}
                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tests..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Test Suites */}
                <div className="space-y-6">
                    {filteredSuites.map((suite, suiteIndex) => {
                        const summary = getSuiteSummary(suite);

                        return (
                            <div key={suite.name} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-green-600">✓ {summary.passed}</span>
                                            <span className="text-red-600">✗ {summary.failed}</span>
                                            <span className="text-gray-500">○ {summary.pending}</span>
                                            <span className="text-gray-700">Total: {summary.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {suite.tests.map((test, testIndex) => {
                                        const testKey = `${suiteIndex}-${testIndex}`;

                                        return (
                                            <div key={testKey} className="px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {getStatusIcon(test.status)}
                                                        <div>
                                                            <div className="font-medium text-gray-900">{test.name}</div>
                                                            <div className="text-sm text-gray-500">{test.endpoint}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        {test.duration && (
                                                            <span className="text-xs text-gray-500">
                                {test.duration}ms
                              </span>
                                                        )}
                                                        {test.count !== undefined && (
                                                            <span className="text-xs text-gray-500">
                                {test.count} items
                              </span>
                                                        )}
                                                        {(test.data || test.error) && (
                                                            <button
                                                                onClick={() => toggleResults(testKey)}
                                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                                            >
                                                                {showResults[testKey] ? (
                                                                    <>
                                                                        <EyeOff className="w-4 h-4" />
                                                                        Hide
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Eye className="w-4 h-4" />
                                                                        View
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Error Display */}
                                                {test.error && (
                                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                                        <div className="text-sm text-red-800 font-medium">Error:</div>
                                                        <div className="text-sm text-red-700">{test.error}</div>
                                                    </div>
                                                )}

                                                {/* Results Display */}
                                                {showResults[testKey] && test.data && (
                                                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                                        <div className="text-sm text-gray-700 font-medium mb-2">Response Data:</div>
                                                        <pre className="text-xs text-gray-600 overflow-x-auto max-h-40 overflow-y-auto">
                              {JSON.stringify(test.data, null, 2)}
                            </pre>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Overall Summary */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {testSuites.map((suite) => {
                            const summary = getSuiteSummary(suite);
                            const successRate = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0;

                            return (
                                <div key={suite.name} className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{successRate.toFixed(0)}%</div>
                                    <div className="text-sm text-gray-600">{suite.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {summary.passed}/{summary.total} passed
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}