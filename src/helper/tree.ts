export type Node = {
    id: string
    parent_id?: string | null
    position?: number
    is_original?: boolean
    children?: Node[]
    is_linked_section?: boolean
    is_linked_section_child?: boolean
  }
  
  export type NodeMap = Map<string, Node> // Map<id, node>
  export type ChildrenMap = Map<string, string[]> // Map<parent_io, children_ids>
  
  export type GetChildrenParams = {
    nodeMap: NodeMap
    childrenMap: ChildrenMap
    parent: Node
    options?: ConvertFromArrayOptions
  }
  
  export type ConvertFromArrayOptions = {
    convert_original?: boolean
  }
  
  export class TreeHelper {
    /**
     *
     * @param {Node[]} list
     * @return {*}
     * @memberof TreeHelper
     */
    static convertFromArray(list: Node[], options?: ConvertFromArrayOptions) {
      const trees: Node[] = []
      const nodeMap: NodeMap = new Map<string, Node>()
      const childrenMap: ChildrenMap = new Map<string, string[]>()
  
      list.forEach((node) => {
        node.children = []
        if (!node.is_original) {
          node.is_linked_section = true
          node.is_linked_section_child = false
        } else {
          node.is_linked_section = false
          node.is_linked_section_child = false
        }
  
        nodeMap.set(node.id, node)
  
        if (node.parent_id === null || !node.parent_id) {
          trees.push(node)
        } else if (node.parent_id) {
          let childrenIds = childrenMap.get(node.parent_id)
          if (childrenIds) {
            childrenIds.push(node.id)
          } else {
            childrenIds = [node.id]
          }
          childrenMap.set(node.parent_id, childrenIds)
        }
      })
  
      trees.forEach((rootNode) => {
        const children = this.getChildren({
          parent: rootNode,
          childrenMap,
          nodeMap,
          options,
        })
        rootNode.children = children
      })
  
      return trees
    }
    // is_linked_section / link ko link
    // is_linked_section_child: / con cua tk link hay ko
  
    /**
     * @description Get nested children
     * @param {GetChildrenParams} params
     * @return {*}
     * @memberof TreeHelper
     */
    private static getChildren(params: GetChildrenParams) {
      const { childrenMap, nodeMap, parent, options } = params
      const childrenIds = childrenMap.get(parent.id)
      if (!childrenIds) {
        return []
      }
  
      const children: Node[] = []
      childrenIds.forEach((id: string) => {
        const child = nodeMap.get(id)
        if (child) {
          
          if (options?.convert_original) {
            if(!child.is_original){
              child.is_linked_section = true
            } else {
              child.is_linked_section = false
            }
  
            if (parent?.is_linked_section || parent?.is_linked_section_child) {
              child.is_linked_section_child = true
            } else {
              child.is_linked_section_child = false
            }
          }
          const grandChildren = this.getChildren({
            parent: child,
            childrenMap,
            nodeMap,
            options
          })
          child.children = grandChildren
          children.push(child)
        }
      })
  
      children.sort((childA, childB) => Number(childA.position) - Number(childB.position))
  
      return children
    }
  }