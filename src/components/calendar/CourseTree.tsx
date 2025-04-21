'use client'
import { useState, useMemo } from 'react'
import SappIcon from 'src/common/SappIcon'

interface CourseSection {
  id: string
  name: string
  code: string
  course_section_type: string
}

interface CourseItem {
  id: string
  course_section_id: string
  course_section_parent_id: string | null
  course_section: CourseSection
}

interface TreeNode extends CourseItem {
  children: TreeNode[]
}

const CourseTree = ({ data }: { data: CourseItem[] }) => {
  // Chuyển danh sách phẳng thành cấu trúc cây
  const treeData = useMemo(() => {
    const map = new Map<string, TreeNode>()
    const roots: TreeNode[] = []

    data.forEach((item) => {
      map.set(item.course_section_id, { ...item, children: [] })
    })

    data.forEach((item) => {
      const node = map.get(item.course_section_id)!
      if (item.course_section_parent_id) {
        const parent = map.get(item.course_section_parent_id)
        if (parent) parent.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }, [data])

  return <TreeNodeList nodes={treeData} />
}

const TreeNodeList = ({ nodes }: { nodes: TreeNode[] }) => {
  return (
    <ul className="space-y-2">
      {nodes.map((node) => (
        <TreeNodeItem key={node.id} node={node} />
      ))}
    </ul>
  )
}

const TreeNodeItem = ({ node }: { node: TreeNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li className="pl-4">
      <div
        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {node.children.length > 0 && (
          <span className="text-lg">
            {isOpen ? (
              <SappIcon icon={'arrowDownFull'} />
            ) : (
              <SappIcon icon={'arrowRightFull'} />
            )}
          </span>
        )}
        <span className="font-normal text-[#404041]">
          {node.course_section.name}
        </span>
      </div>
      {isOpen && node.children.length > 0 && (
        <TreeNodeList nodes={node.children} />
      )}
    </li>
  )
}

export default CourseTree
