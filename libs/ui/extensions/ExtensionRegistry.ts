type ExtensionComponent = React.ComponentType<any>;

const registry = new Map<string, ExtensionComponent[]>();

const ExtensionRegistry = {
  /**
   * Register a component extension to a specific slot.
   * @param slotName The unique identifier for the slot
   * @param Component The React component to render in the slot
   */
  register: (slotName: string, Component: ExtensionComponent) => {
    if (!registry.has(slotName)) {
      registry.set(slotName, []);
    }
    registry.get(slotName)!.push(Component);
  },

  /**
   * Get all registered extensions for a given slot.
   * @param slotName The unique identifier for the slot
   * @returns Array of registered components
   */
  getExtensions: (slotName: string): ExtensionComponent[] => {
    return registry.get(slotName) || [];
  },
};

export default ExtensionRegistry;
