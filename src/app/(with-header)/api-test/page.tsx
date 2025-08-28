// src/app/api-test/page.tsx
'use client'

import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { createWPSClient, WPSApiClient } from '@/lib/api/wps-client'

interface TestResult {
  endpoint: string
  method: string
  status: 'pending' | 'success' | 'error'
  response?: any
  error?: string
  timestamp: number
}

interface EndpointConfig {
  name: string
  endpoint: string
  method: 'GET' | 'POST'
  params?: Record<string, any>
  body?: any
}

// Define test endpoints
const TEST_ENDPOINTS: EndpointConfig[] = [
  {
    name: 'Get Brands',
    endpoint: '/api/brands',
    method: 'GET',
  },
  {
    name: 'Get Categories',
    endpoint: '/api/categories',
    method: 'GET',
  },
  {
    name: 'Get Items (Basic)',
    endpoint: '/api/items',
    method: 'GET',
    params: { 'page[size]': 5 },
  },
  {
    name: 'Get Items with Images',
    endpoint: '/api/items',
    method: 'GET',
    params: { 'page[size]': 3, include: 'images,brand,product' },
  },
  {
    name: 'Get Custom Categories',
    endpoint: '/api/custom-categories',
    method: 'GET',
  },
  {
    name: 'Get Products',
    endpoint: '/api/products',
    method: 'GET',
    params: { 'page[size]': 5 },
  },
  {
    name: 'Get Vehicle Makes',
    endpoint: '/api/vehicles/makes',
    method: 'GET',
  },
]

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [_selectedEndpoint, _setSelectedEndpoint] = useState<string | null>(null)
  const [showResponse, setShowResponse] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [wpsClient, setWpsClient] = useState<WPSApiClient | null>(null)

  // Initialize WPS client
  useEffect(() => {
    try {
      const client = createWPSClient()
      setWpsClient(client)
    } catch (error) {
      console.error('Failed to initialize WPS client:', error)
    }
  }, [])

  const runSingleTest = async (config: EndpointConfig) => {
    const testKey = config.name
    setResults(prev => ({
      ...prev,
      [testKey]: {
        endpoint: config.endpoint,
        method: config.method,
        status: 'pending',
        timestamp: Date.now(),
      },
    }))

    try {
      const url = new URL(config.endpoint, window.location.origin)
      if (config.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value))
        })
      }

      const response = await fetch(url.toString(), {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
      })

      const data = await response.json()

      setResults(prev => ({
        ...prev,
        [testKey]: {
          endpoint: config.endpoint,
          method: config.method,
          status: response.ok ? 'success' : 'error',
          response: data,
          error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
          timestamp: Date.now(),
        },
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testKey]: {
          endpoint: config.endpoint,
          method: config.method,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        },
      }))
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setResults({})

    for (const config of TEST_ENDPOINTS) {
      await runSingleTest(config)
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsRunning(false)
  }

  const toggleResponseVisibility = (testKey: string) => {
    setShowResponse(prev => ({
      ...prev,
      [testKey]: !prev[testKey],
    }))
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredEndpoints = TEST_ENDPOINTS.filter(endpoint =>
    endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Test Dashboard</h1>
        <p className="text-gray-600">Test and monitor API endpoints in development</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search endpoints..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {filteredEndpoints.map((config) => {
          const result = results[config.name]
          const isResponseVisible = showResponse[config.name]

          return (
            <div key={config.name} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result?.status)}
                  <h3 className="font-medium text-gray-900">{config.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    config.method === 'GET' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {config.method}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result && (
                    <button
                      onClick={() => toggleResponseVisibility(config.name)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title={isResponseVisible ? 'Hide response' : 'Show response'}
                    >
                      {isResponseVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => runSingleTest(config)}
                    disabled={isRunning}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <code className="bg-gray-100 px-2 py-1 rounded">{config.endpoint}</code>
                {config.params && (
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">Params: </span>
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                      {JSON.stringify(config.params)}
                    </code>
                  </div>
                )}
              </div>

              {result && (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Status: {result.status}</span>
                    <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>

                  {result.error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                      {result.error}
                    </div>
                  )}

                  {result.response && isResponseVisible && (
                    <div className="mt-2">
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96 border">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {wpsClient && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">WPS Client Status</h3>
          <p className="text-blue-800 text-sm">
            ✓ WPS Client initialized successfully
          </p>
          <p className="text-blue-700 text-xs mt-1">
            Base URL: {wpsClient.baseUrl}
          </p>
        </div>
      )}
    </div>
  )
}