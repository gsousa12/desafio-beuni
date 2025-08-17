# 📚 Guia de Uso - API Hooks Customizados

Este documento mostra como usar a estrutura de hooks customizados para integração com a API.

## 🏗️ Estrutura Base

A estrutura processa automaticamente os responses da API, organizando os dados de forma consistente:

```typescript
// Response processado disponível em data:
{
  data: T[];           // Array completo dos dados
  singleItem: T | null; // Primeiro item (útil para endpoints que retornam 1 objeto)
  message: string;     // Mensagem da API
  meta: PaginationMeta | {}; // Meta de paginação (quando disponível)
  hasPagination: boolean;    // Se tem dados de paginação
  isArray: boolean;          // Se retornou múltiplos itens
}
```

---

## 🔄 **MUTATIONS - Exemplos Práticos**

### **1. Login (Mutation Básica)**

```typescript
// types/auth.ts
type LoginResponseData = {
  email: string;
  full_name: string;
  token?: string;
};

type LoginFormValues = {
  email: string;
  password: string;
};

// controllers/useLoginController.ts
import { useApiMutation } from "../api/hooks/api-hooks";
import { api } from "../api/axios";

export const useLoginController = () => {
  const {
    mutateAsync: submitLogin,
    data,
    isPending,
    isError,
    error,
  } = useApiMutation<LoginResponseData, LoginFormValues>((loginData) =>
    api.post("auth/login", loginData)
  );

  const handleSubmitLogin = async (formData: LoginFormValues) => {
    try {
      const result = await submitLogin(formData);

      // ✅ Dados já organizados e prontos para uso
      alert(`Login bem-sucedido: ${result.message}`);
      console.log("Usuário logado:", result.singleItem);

      // Salvar token se necessário
      if (result.singleItem?.token) {
        localStorage.setItem("token", result.singleItem.token);
      }

      return result;
    } catch (error: any) {
      // ✅ Erro já vem formatado
      alert(`Erro no login: ${error.message}`);
      throw error;
    }
  };

  return {
    handleSubmitLogin,
    isPending,
    isError,
    error: error?.message,
    // ✅ Dados do usuário logado disponíveis diretamente
    loggedUser: data?.singleItem,
    loginMessage: data?.message,
  };
};
```

### **2. Criar Produto (Mutation com Payload Complexo)**

```typescript
// types/product.ts
type ProductData = {
  id: number;
  name: string;
  price: number;
  category_id: number;
};

type CreateProductPayload = {
  name: string;
  price: number;
  category_id: number;
  description?: string;
};

// controllers/useCreateProductController.ts
export const useCreateProductController = () => {
  const mutation = useApiMutation<ProductData, CreateProductPayload>((productData) =>
    api.post("/products", productData)
  );

  const handleCreateProduct = async (productData: CreateProductPayload) => {
    try {
      const result = await mutation.mutateAsync(productData);

      alert(`Produto criado: ${result.message}`);
      console.log("Novo produto:", result.singleItem);

      // Invalidar cache de produtos para recarregar listas
      // queryClient.invalidateQueries(['products']);

      return result.singleItem; // Retorna o produto criado
    } catch (error: any) {
      alert(`Erro ao criar produto: ${error.message}`);
      throw error;
    }
  };

  return {
    handleCreateProduct,
    isCreating: mutation.isPending,
    createError: mutation.error?.message,
    createdProduct: mutation.data?.singleItem,
  };
};
```

---

## 🔍 **QUERIES - Exemplos Práticos**

### **3. Listar Produtos (Query com Paginação)**

```typescript
// controllers/useProductsController.ts
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export const useProductsController = (page: number = 1, search?: string) => {
  const { data, isLoading, error } = useApiQuery<Product>(
    ["products", page, search], // Query key com dependências
    () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (search) params.append("search", search);

      return api.get(`/products?${params.toString()}`);
    }
  );

  return {
    // ✅ Lista de produtos
    products: data?.data || [],
    isLoading,
    error: error?.message,

    // ✅ Dados de paginação organizados
    currentPage: data?.hasPagination ? (data.meta as any).current_page : 1,
    totalPages: data?.hasPagination ? (data.meta as any).total_pages : 1,
    total: data?.hasPagination ? (data.meta as any).total : data?.data.length,
    hasNext: data?.hasPagination ? (data.meta as any).has_next : false,
    hasPrevious: data?.hasPagination ? (data.meta as any).has_previous : false,

    // ✅ Mensagem da API
    responseMessage: data?.message,
  };
};
```

### **4. Buscar Produto por ID (Query Única)**

```typescript
// controllers/useProductController.ts
export const useProductController = (productId: string) => {
  const { data, isLoading, error, refetch } = useApiQuery<Product>(
    ["product", productId],
    () => api.get(`/products/${productId}`),
    {
      enabled: !!productId, // Só executa se tiver o productId
    }
  );

  return {
    // ✅ Produto único (primeiro item do array)
    product: data?.singleItem,
    isLoading,
    error: error?.message,
    refetch,

    // ✅ Controles úteis
    isFound: !!data?.singleItem,
    responseMessage: data?.message,
  };
};
```

### **5. Query com Filtros Dinâmicos**

```typescript
// controllers/useUsersController.ts
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UserFilters = {
  role?: string;
  status?: "active" | "inactive";
  search?: string;
};

export const useUsersController = (filters: UserFilters = {}, page: number = 1) => {
  const { data, isLoading, error } = useApiQuery<User>(["users", filters, page], () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    return api.get(`/users?${params.toString()}`);
  });

  return {
    users: data?.data || [],
    isLoading,
    error: error?.message,

    // Paginação
    pagination: data?.hasPagination
      ? {
          currentPage: (data.meta as any).current_page,
          totalPages: (data.meta as any).total_pages,
          total: (data.meta as any).total,
          hasNext: (data.meta as any).has_next,
          hasPrevious: (data.meta as any).has_previous,
        }
      : null,
  };
};
```

---

## ⚡ **Uso em Componentes React**

### **Exemplo 1: Lista de Produtos com Paginação**

```tsx
import React, { useState } from "react";
import { useProductsController } from "./controllers/useProductsController";

export const ProductsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    products,
    isLoading,
    error,
    currentPage: apiPage,
    totalPages,
    hasNext,
    hasPrevious,
  } = useProductsController(currentPage, search);

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Produtos</h2>

      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lista */}
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>R$ {product.price}</p>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div>
        <button disabled={!hasPrevious} onClick={() => setCurrentPage((p) => p - 1)}>
          Anterior
        </button>

        <span>
          Página {apiPage} de {totalPages}
        </span>

        <button disabled={!hasNext} onClick={() => setCurrentPage((p) => p + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
};
```

### **Exemplo 2: Formulário de Login**

```tsx
import React, { useState } from "react";
import { useLoginController } from "./controllers/useLoginController";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { handleSubmitLogin, isPending, error } = useLoginController();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitLogin(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>

      {error && <div style={{ color: "red" }}>Erro: {error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
        required
      />

      <button type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};
```

---

## 🎯 **Vantagens da Estrutura**

### ✅ **Consistência**

- Todos os endpoints seguem o mesmo padrão

- Sempre acesso a `data`, `singleItem`, `message`, `meta`

### ✅ **Tipagem Completa**

- TypeScript garante segurança em tempo de compilação

- Intellisense completo nos dados

### ✅ **Tratamento de Erro Padronizado**

- Erros sempre vêm com `message` formatado

- Sem necessidade de navegar por `response.data.message`

### ✅ **Dados Organizados**

- Array completo em `data`

- Item único em `singleItem` (útil para get by ID)

- Paginação organizada em `meta`

### ✅ **Reutilização**

- Um hook serve para qualquer endpoint

- Controllers focam na lógica de negócio, não na estrutura da API

---

## 🚀 **Próximos Passos**

1. **Implemente os hooks customizados** (`api-hooks.ts`)

2. **Refatore seus controllers existentes** seguindo os exemplos

3. **Atualize os componentes** para usar os novos controllers

4. **Configure invalidação de cache** quando necessário

5. **Adicione tratamento de loading states** nos componentes

Esta estrutura vai deixar sua integração com a API muito mais limpa, tipada e fácil de manter! 🎉Criei um documento completo **`doc.md`** que serve como guia prático para usar a estrutura de hooks customizados! 📚

## 📋 **O que está no documento:**

### **🔄 Mutations - Exemplos Completos:**

- **Login**: Mutation básica com tratamento de erro
- **Criar Produto**: Mutation com payload complexo e invalidação de cache

### **🔍 Queries - Casos Práticos:**

- **Lista com Paginação**: Query com filtros e dados organizados
- **Buscar por ID**: Query única com controle de execução
- **Filtros Dinâmicos**: Query complexa com múltiplos parâmetros

### **⚡ Componentes React:**

- **Lista de Produtos**: Exemplo completo com paginação e busca
- **Formulário de Login**: Integração com mutation e loading states

### **🎯 Principais Destaques:**

1. **Dados Sempre Organizados:**

   ```typescript
   const { data, isLoading, error } = useApiQuery([...]);

   // Dados sempre organizados:
   data?.data          // Array completo
   data?.singleItem    // Primeiro item (para get by ID)
   data?.message       // Mensagem da API
   data?.meta          // Meta de paginação
   data?.hasPagination // Boolean se tem paginação
   ```

2. **Erros Padronizados:**

   ```typescript
   catch (error: any) {
     alert(error.message); // Já vem a mensagem certa da API
   }
   ```

3. **Controllers Limpos:**

   ```typescript
   const controller = useProductsController(page);
   // controller.hasNext, controller.totalPages, etc.
   ```

4. **Usage Direto:**
   ```typescript
   const result = await submitLogin(formData);
   alert(`Login bem-sucedido: ${result.message}`);
   console.log("Usuário:", result.singleItem); // Pega o user do array
   ```

O documento está organizado de forma didática, com exemplos práticos que você pode usar diretamente no seu projeto! 🚀
