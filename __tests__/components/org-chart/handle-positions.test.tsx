import { render } from '@testing-library/react'
import { ReactFlowProvider, Position } from 'reactflow'
import { BaseAnimatedNode } from '@/components/org-chart/nodes/base-animated-node'
import { BaseNode } from '@/components/org-chart/nodes/base-node'

describe('Handle Positions', () => {
  const ReactFlowWrapper = ({ children }: { children: React.ReactNode }) => (
    <ReactFlowProvider>{children}</ReactFlowProvider>
  )

  describe('BaseAnimatedNode', () => {
    it('should use TOP/BOTTOM handles for DOWN direction', () => {
      const { container } = render(
        <BaseAnimatedNode
          data={{ id: 'test-1' }}
          direction="DOWN"
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseAnimatedNode>,
        { wrapper: ReactFlowWrapper }
      )

      const handles = container.querySelectorAll('.react-flow__handle')
      expect(handles).toHaveLength(2)

      // Should have top and bottom handles
      const topHandle = container.querySelector('.react-flow__handle-top')
      const bottomHandle = container.querySelector('.react-flow__handle-bottom')
      
      expect(topHandle).toBeInTheDocument()
      expect(bottomHandle).toBeInTheDocument()
    })

    it('should use LEFT/RIGHT handles for RIGHT direction', () => {
      const { container } = render(
        <BaseAnimatedNode
          data={{ id: 'test-1' }}
          direction="RIGHT"
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseAnimatedNode>,
        { wrapper: ReactFlowWrapper }
      )

      const handles = container.querySelectorAll('.react-flow__handle')
      expect(handles).toHaveLength(2)

      // Should have left and right handles
      const leftHandle = container.querySelector('.react-flow__handle-left')
      const rightHandle = container.querySelector('.react-flow__handle-right')
      
      expect(leftHandle).toBeInTheDocument()
      expect(rightHandle).toBeInTheDocument()
    })

    it('should default to DOWN direction', () => {
      const { container } = render(
        <BaseAnimatedNode
          data={{ id: 'test-1' }}
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseAnimatedNode>,
        { wrapper: ReactFlowWrapper }
      )

      // Default should be DOWN (vertical)
      const topHandle = container.querySelector('.react-flow__handle-top')
      const bottomHandle = container.querySelector('.react-flow__handle-bottom')
      
      expect(topHandle).toBeInTheDocument()
      expect(bottomHandle).toBeInTheDocument()
    })

    it('should allow explicit handle position override', () => {
      const { container } = render(
        <BaseAnimatedNode
          data={{ id: 'test-1' }}
          direction="DOWN"
          sourcePosition={Position.Left}
          targetPosition={Position.Right}
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseAnimatedNode>,
        { wrapper: ReactFlowWrapper }
      )

      // Should use explicit positions despite DOWN direction
      const leftHandle = container.querySelector('.react-flow__handle-left')
      const rightHandle = container.querySelector('.react-flow__handle-right')
      
      expect(leftHandle).toBeInTheDocument()
      expect(rightHandle).toBeInTheDocument()
    })
  })

  describe('BaseNode', () => {
    it('should use TOP/BOTTOM handles for DOWN direction', () => {
      const { container } = render(
        <BaseNode
          direction="DOWN"
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseNode>,
        { wrapper: ReactFlowWrapper }
      )

      const handles = container.querySelectorAll('.react-flow__handle')
      expect(handles).toHaveLength(2)

      const topHandle = container.querySelector('.react-flow__handle-top')
      const bottomHandle = container.querySelector('.react-flow__handle-bottom')
      
      expect(topHandle).toBeInTheDocument()
      expect(bottomHandle).toBeInTheDocument()
    })

    it('should use LEFT/RIGHT handles for RIGHT direction', () => {
      const { container } = render(
        <BaseNode
          direction="RIGHT"
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseNode>,
        { wrapper: ReactFlowWrapper }
      )

      const handles = container.querySelectorAll('.react-flow__handle')
      expect(handles).toHaveLength(2)

      const leftHandle = container.querySelector('.react-flow__handle-left')
      const rightHandle = container.querySelector('.react-flow__handle-right')
      
      expect(leftHandle).toBeInTheDocument()
      expect(rightHandle).toBeInTheDocument()
    })

    it('should support UP direction with TOP/BOTTOM handles', () => {
      const { container } = render(
        <BaseNode
          direction="UP"
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseNode>,
        { wrapper: ReactFlowWrapper }
      )

      // UP is also vertical, should use top/bottom
      const topHandle = container.querySelector('.react-flow__handle-top')
      const bottomHandle = container.querySelector('.react-flow__handle-bottom')
      
      expect(topHandle).toBeInTheDocument()
      expect(bottomHandle).toBeInTheDocument()
    })

    it('should support LEFT direction with LEFT/RIGHT handles', () => {
      const { container } = render(
        <BaseNode
          direction="LEFT"
          hasSourceHandle={true}
          hasTargetHandle={true}
        >
          <div>Test Content</div>
        </BaseNode>,
        { wrapper: ReactFlowWrapper }
      )

      // LEFT is horizontal, should use left/right
      const leftHandle = container.querySelector('.react-flow__handle-left')
      const rightHandle = container.querySelector('.react-flow__handle-right')
      
      expect(leftHandle).toBeInTheDocument()
      expect(rightHandle).toBeInTheDocument()
    })
  })
})
