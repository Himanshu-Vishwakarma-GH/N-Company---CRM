import { createContext, useContext, useMemo, useState } from "react";
import { invoices, clients } from "../data/centralData";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");

  const searchIndex = useMemo(() => {
    const index = new Map();

    // 🔹 Index invoices
    invoices.forEach((inv) => {
      if (inv.invoiceNumber) {
        index.set(inv.invoiceNumber.toLowerCase(), {
          type: "invoice",
          data: inv,
        });
      }

      if (inv.clientId) {
        index.set(inv.clientId.toLowerCase(), {
          type: "invoice",
          data: inv,
        });
      }
    });

    // 🔹 Index clients
    clients.forEach((cl) => {
      if (cl.id) {
        index.set(cl.id.toLowerCase(), {
          type: "client",
          data: cl,
        });
      }

      if (cl.name) {
        index.set(cl.name.toLowerCase(), {
          type: "client",
          data: cl,
        });
      }
    });

    return index;
  }, []);

  const search = (text) => {
    if (!text) return null;
    return searchIndex.get(text.toLowerCase());
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, search }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
