import { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const typedocSidebar: SidebarsConfig = {
  items: [
    {
      type: "category",
      label: "Type Aliases",
      items: [
        {
          type: "doc",
          id: "api/type-aliases/Options",
          label: "Options"
        }
      ]
    },
    {
      type: "category",
      label: "Functions",
      items: [
        {
          type: "doc",
          id: "api/functions/createRouter",
          label: "createRouter"
        },
        {
          type: "doc",
          id: "api/functions/handleRequest",
          label: "handleRequest"
        },
        {
          type: "doc",
          id: "api/functions/runRouter",
          label: "runRouter"
        },
        {
          type: "doc",
          id: "api/functions/tracePrototypeChainOf",
          label: "tracePrototypeChainOf"
        }
      ]
    }
  ]
};
export default typedocSidebar;