import { SidebarsConfig } from "@docusaurus/plugin-content-docs";
const typedocSidebar: SidebarsConfig = {
  items: [
    {
      type: "category",
      label: "Type Aliases",
      items: [
        {
          type: "doc",
          id: "../api-generated/type-aliases/Options",
          label: "Options"
        },
        {
          type: "doc",
          id: "../api-generated/type-aliases/WrapperRequestType",
          label: "WrapperRequestType"
        }
      ]
    },
    {
      type: "category",
      label: "Functions",
      items: [
        {
          type: "doc",
          id: "../api-generated/functions/createRouter",
          label: "createRouter"
        },
        {
          type: "doc",
          id: "../api-generated/functions/handleRequest",
          label: "handleRequest"
        },
        {
          type: "doc",
          id: "../api-generated/functions/runRouter",
          label: "runRouter"
        },
        {
          type: "doc",
          id: "../api-generated/functions/tracePrototypeChainOf",
          label: "tracePrototypeChainOf"
        }
      ]
    }
  ]
};
export default typedocSidebar;