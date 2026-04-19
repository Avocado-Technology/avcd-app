export const mockReactFlowHooks = () => {
  const mockSetNodes = jest.fn()
  const mockGetNodes = jest.fn(() => [])
  const mockGetEdges = jest.fn(() => [])
  const mockFitView = jest.fn()
  
  jest.mock('reactflow', () => ({
    ...jest.requireActual('reactflow'),
    useNodesInitialized: jest.fn().mockReturnValue(true),
    useReactFlow: jest.fn().mockReturnValue({
      setNodes: mockSetNodes,
      getNodes: mockGetNodes,
      getEdges: mockGetEdges,
      fitView: mockFitView
    })
  }))
  
  return { mockSetNodes, mockGetNodes, mockGetEdges, mockFitView }
}
