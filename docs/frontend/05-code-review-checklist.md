# Code Review Checklist

## Overview

Bu checklist, Pull Request göndermeden önce kontrol edilmesi gereken zorunlu maddeleri içerir.

---

## 🎯 Pre-PR Checklist

PR oluşturmadan önce tüm maddeleri kontrol edin:

- [ ] Tüm değişiklikler commit edildi
- [ ] `npm run lint` başarılı
- [ ] `npm run build` başarılı
- [ ] `npm run test` başarılı (testler varsa)
- [ ] Tüm console.log/debugger ifadeleri kaldırıldı
- [ ] Git branch naming convention'a uygun (`feature/`, `bugfix/`, `refactor/`)
- [ ] Commit message'lar conventional commit formatında

---

## 1️⃣ SSOT (Single Source of Truth) Validation

### ✅ Type Definitions

- [ ] **Tüm API type'ları `src/types/api/` altında tanımlı**
- [ ] **Inline API type tanımı yok** (component, hook, service içinde)
- [ ] **OpenAPI schema isimleri aynen kullanılmış** (Product → Product, ProductDTO değil)
- [ ] **Nullable field'lar `T | null` ile işaretlenmiş**
- [ ] **Optional field'lar `T?` veya `T | undefined` ile işaretlenmiş**
- [ ] **date-time field'lar `string` olarak tanımlanmış** (Date objesi değil)

### ✅ Type Usage

- [ ] **Component'lerde inline type tanımı yok**
  ```typescript
  // ❌ YANLIŞ
  export function ProductCard({ product }: { product: { id: string } }) { }
  
  // ✅ DOĞRU
  export function ProductCard({ product }: { product: Product }) { }
  ```

- [ ] **API type'ları modifiye edilmemiş** (extends, Omit, Pick ile değiştirilmemiş)
  ```typescript
  // ❌ YANLIŞ
  export interface ProductDTO extends Product { isSelected: boolean; }
  
  // ✅ DOĞRU
  export interface ProductViewModel { product: Product; isSelected: boolean; }
  ```

- [ ] **Alternative isimler kullanılmamış** (ProductDTO, IProduct, ProductModel)

---

## 2️⃣ Layer Architecture Validation

### ✅ UI Layer (Components, Pages)

- [ ] **Component'ler sadece hook çağırıyor** (service/API değil)
- [ ] **Component'lerde iş mantığı yok** (validation, transformation)
- [ ] **Component'lerde HTTP çağrısı yok** (fetch, axios)
- [ ] **Event handler isimleri `handle` prefix ile başlıyor** (`handleClick`, `handleSubmit`)
- [ ] **Callback prop'ları `on` prefix ile başlıyor** (`onClick`, `onDelete`)

```typescript
// ✅ DOĞRU
export function ProductList() {
  const { products, loading, error } = useProducts();  // ✅ Hook kullanımı
  
  const handleDelete = (id: string) => {
    // Event handling logic
  };
  
  return <div>...</div>;
}

// ❌ YANLIŞ
export function ProductList() {
  useEffect(() => {
    ProductService.getAll();  // ❌ Service direkt çağrılmamalı
  }, []);
}
```

### ✅ State Layer (Hooks, Store, Context)

- [ ] **Hook'lar sadece service çağırıyor** (API direkt değil)
- [ ] **Hook'larda HTTP çağrısı yok** (ProductsAPI.listProducts() gibi)
- [ ] **Hook isimleri `use` ile başlıyor** (`useProducts`, `useAuth`)
- [ ] **Hook'lar obje döndürüyor** (array değil) → `{ products, loading }` ✅, `[products, loading]` ❌

```typescript
// ✅ DOĞRU
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  
  async function loadProducts() {
    const data = await ProductService.getAll();  // ✅ Service kullanımı
    setProducts(data);
  }
  
  return { products, loadProducts };  // ✅ Object return
}

// ❌ YANLIŞ
export function useProducts() {
  useEffect(() => {
    ProductsAPI.listProducts();  // ❌ API direkt çağrılmamalı
  }, []);
  
  return [products, loadProducts];  // ❌ Array return (tuple pattern)
}
```

### ✅ Business Layer (Services)

- [ ] **Service'ler sadece API çağırıyor** (hook/component değil)
- [ ] **Service'lerde React import yok** (`useState`, `useEffect`)
- [ ] **Service'lerde JSX yok**
- [ ] **Service'lerde component import yok**
- [ ] **İş mantığı (validation, transformation) service'de**
- [ ] **Service method'ları static** (class-based) veya export edilen fonksiyonlar

```typescript
// ✅ DOĞRU
export class ProductService {
  static async getAll(): Promise<Product[]> {
    const response = await ProductsAPI.listProducts({ page: 0, size: 50 });
    return response.items;
  }
  
  static validatePrice(price: number): boolean {  // ✅ Business logic
    return price >= 0;
  }
}

// ❌ YANLIŞ
import { useState } from 'react';  // ❌ React import yasak

export class ProductService {
  static useProducts() {  // ❌ Hook service'de olamaz
    const [products] = useState([]);
  }
}
```

### ✅ API Layer

- [ ] **API dosyaları sadece HTTP çağrıları yapıyor**
- [ ] **API method isimleri OpenAPI operationId ile eşleşiyor**
- [ ] **API'da iş mantığı yok** (validation, transformation)
- [ ] **API'da React import yok**
- [ ] **API method'ları raw API response döndürüyor**

```typescript
// ✅ DOĞRU
export class ProductsAPI {
  static async listProducts(params: ListProductsParams): Promise<ProductPageResponse> {
    const response = await apiClient.get('/api/v1/products', { params });
    return response.data;  // ✅ Raw API response
  }
}

// ❌ YANLIŞ
export class ProductsAPI {
  static async listProducts() {
    const response = await apiClient.get('/api/v1/products');
    
    // ❌ Transformation API'da olmamalı (service'e ait)
    return response.data.items.filter(p => p.inStock);
  }
}
```

---

## 3️⃣ Import Rules Validation

### ✅ Layer Boundaries

- [ ] **UI → State** ✅ (allowed)
- [ ] **State → Business** ✅ (allowed)
- [ ] **Business → API** ✅ (allowed)
- [ ] **UI → Business** ❌ (forbidden, skip State)
- [ ] **UI → API** ❌ (forbidden, skip State + Business)
- [ ] **State → API** ❌ (forbidden, skip Business)
- [ ] **Business → State** ❌ (forbidden, reverse direction)
- [ ] **API → Business/State/UI** ❌ (forbidden, reverse direction)

### ✅ Import Order

- [ ] **Import'lar doğru sırada:** External → Internal → Types → Utils → Styles
- [ ] **Type import'lar `type` keyword ile işaretlenmiş**
  ```typescript
  import type { Product } from '@/types/api/products.types';  // ✅
  ```

### ✅ Circular Dependencies

- [ ] **Circular import yok** (`eslint-plugin-import` ile kontrol edin)
- [ ] **Service'ler birbirini çağırmıyor** (shared utility kullan)

---

## 4️⃣ Naming Conventions

### ✅ Files

- [ ] **Component dosyaları `PascalCase.tsx`** (`ProductCard.tsx`)
- [ ] **Page dosyaları `PascalCase + Page.tsx`** (`ProductsPage.tsx`)
- [ ] **Hook dosyaları `camelCase.ts`** (`useProducts.ts`)
- [ ] **Service dosyaları `camelCase.service.ts`** (`products.service.ts`)
- [ ] **API dosyaları `camelCase.api.ts`** (`products.api.ts`)
- [ ] **Type dosyaları `camelCase.types.ts`** (`products.types.ts`)

### ✅ Code

- [ ] **Component isimleri `PascalCase`** (`ProductCard`)
- [ ] **Hook isimleri `use` ile başlıyor** (`useProducts`)
- [ ] **Function isimleri `camelCase` ve verb-based** (`getUserById`, `validateEmail`)
- [ ] **Boolean değişkenler `is/has/should` ile başlıyor** (`isLoading`, `hasError`)
- [ ] **Constant'lar `UPPER_SNAKE_CASE`** (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- [ ] **Interface/Type isimleri `PascalCase`** (`Product`, `ProductResponse`)
- [ ] **"I" prefix yok** (IProduct ❌ → Product ✅)
- [ ] **"DTO" suffix yok** (ProductDTO ❌ → Product ✅, OpenAPI'de yoksa)

---

## 5️⃣ TypeScript Best Practices

### ✅ Type Safety

- [ ] **`any` kullanılmamış** (gerekirse `unknown` kullan)
- [ ] **Type assertion (`as`) minimal kullanılmış** (mümkünse type guard kullan)
- [ ] **Non-null assertion (`!`) minimal kullanılmış**
- [ ] **Optional chaining (`?.`) kullanılmış**
- [ ] **Nullish coalescing (`??`) kullanılmış** (`||` yerine)

```typescript
// ✅ DOĞRU
const price = product?.price ?? 0;  // ✅ Optional chaining + nullish coalescing

// ❌ YANLIŞ
const price = product.price || 0;  // ❌ product.price 0 ise yanlış sonuç
```

### ✅ Type Definitions

- [ ] **Return type'lar explicit** (özellikle public fonksiyonlarda)
  ```typescript
  // ✅ DOĞRU
  export function getProducts(): Promise<Product[]> { }
  
  // ❌ YANLIŞ (return type implicit)
  export function getProducts() { }
  ```

- [ ] **Function parameter'ları type'lı**
- [ ] **Generic type'lar anlamlı isimle** (`T`, `K`, `V` yerine `TData`, `TKey`)

---

## 6️⃣ React Best Practices

### ✅ Hooks

- [ ] **Hooks Rules of React uygulanmış** (döngü/koşul içinde hook çağrısı yok)
- [ ] **useEffect dependency array'i doğru** (eslint-plugin-react-hooks kontrolü)
- [ ] **useMemo/useCallback gerekli yerlerde kullanılmış**
- [ ] **Custom hook'lar reusable ve test edilebilir**

### ✅ Components

- [ ] **Component'ler küçük ve tek sorumlulukta** (max 200 satır)
- [ ] **Props interface tanımlı**
- [ ] **Default export değil named export kullanılmış**
  ```typescript
  export function ProductCard() { }  // ✅
  export default ProductCard;        // ❌
  ```

- [ ] **Conditional rendering açık ve okunabilir**
  ```typescript
  // ✅ DOĞRU
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ProductList products={products} />;
  
  // ❌ YANLIŞ (nested ternary)
  return loading ? <Spinner /> : error ? <ErrorMessage /> : <ProductList />;
  ```

---

## 7️⃣ API Integration

### ✅ OpenAPI Compliance

- [ ] **API endpoint'leri OpenAPI spec ile eşleşiyor**
- [ ] **Request/response type'ları OpenAPI schema ile eşleşiyor**
- [ ] **API versioning uygulanmış** (`/api/v1/products`)
- [ ] **HTTP method'lar RESTful** (GET, POST, PUT, PATCH, DELETE)

### ✅ Error Handling

- [ ] **API hataları yakalanmış ve handle edilmiş**
- [ ] **Error response'lar `ErrorResponse` type'ı kullanıyor**
- [ ] **Network timeout handling var**
- [ ] **Retry logic var (gerekirse)**

```typescript
// ✅ DOĞRU
try {
  const products = await ProductService.getAll();
  setProducts(products);
} catch (error) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('Unknown error');
  }
}
```

---

## 8️⃣ Performance

### ✅ Optimization

- [ ] **Lazy loading kullanılmış** (pages için `React.lazy`)
- [ ] **Bundle size optimize edilmiş** (unnecessary dependencies yok)
- [ ] **Image'lar optimize edilmiş** (webp, lazy load)
- [ ] **List rendering key prop'u doğru** (index değil unique id)

```tsx
// ✅ DOĞRU
{products.map(product => (
  <ProductCard key={product.id} product={product} />  // ✅ Unique id
))}

// ❌ YANLIŞ
{products.map((product, index) => (
  <ProductCard key={index} product={product} />  // ❌ Index kullanma
))}
```

---

## 9️⃣ Code Quality

### ✅ Readability

- [ ] **Kod okunabilir ve self-documenting**
- [ ] **Magic number'lar constant'a çıkarılmış**
- [ ] **Karmaşık logic küçük fonksiyonlara bölünmüş**
- [ ] **Yorum satırları minimal** (kod kendini açıklıyor)
- [ ] **TODO/FIXME yorumları temizlenmiş veya ticketing system'e alınmış**

### ✅ Testing (Varsa)

- [ ] **Unit testler yazılmış**
- [ ] **Test coverage yeterli** (min %70)
- [ ] **Mock'lar doğru kullanılmış**
- [ ] **Integration testler yazılmış** (kritik flow'lar için)

---

## 🔟 Documentation

### ✅ Code Documentation

- [ ] **Public API'ler dokümante edilmiş** (JSDoc)
- [ ] **Karmaşık logic açıklanmış** (why, not what)
- [ ] **README.md güncel** (varsa)

```typescript
/**
 * Retrieves all in-stock products from the backend
 * 
 * @returns Promise resolving to array of in-stock products
 * @throws {Error} If API request fails
 */
export async function getInStockProducts(): Promise<Product[]> {
  const allProducts = await ProductService.getAll();
  return allProducts.filter(p => p.inStock);
}
```

---

## 📋 PR Description Template

```markdown
## Changes

- Added ProductList component
- Implemented useProducts hook
- Created products.service.ts for business logic

## Type

- [ ] Feature
- [ ] Bugfix
- [ ] Refactor
- [ ] Documentation

## Checklist

- [x] SSOT validation passed
- [x] Layer architecture followed
- [x] Import rules checked
- [x] Naming conventions applied
- [x] TypeScript strict mode enabled
- [x] ESLint passed
- [x] Build successful
- [x] No console.log/debugger left

## Testing

- [x] Manual testing done
- [ ] Unit tests added
- [ ] Integration tests added

## Screenshots (if UI change)

[Add screenshots here]
```

---

## 🚨 Critical Issues (Blockers)

Bu maddelerden biri ihlal edilirse PR **merge edilmemeli**:

1. **API type'ları `types/api/` dışında tanımlı**
2. **UI Layer direkt service/API çağırıyor**
3. **State Layer direkt API çağırıyor**
4. **Business Layer React import ediyor**
5. **Circular dependency var**
6. **OpenAPI schema isimleri değiştirilmiş**
7. **ESLint hataları var**
8. **Build başarısız**
9. **Type safety ihlali (`any` kullanımı)**

---

## ⚠️ Warning Issues (Dikkat)

Bu maddeler PR'ı bloklamaz ama düzeltilmeli:

1. Naming convention ihlali
2. Import sırası yanlış
3. Yorum satırları fazla
4. Magic number var
5. TODO/FIXME temizlenmemiş
6. Component çok büyük (>200 satır)
7. Duplicate code var

---

## 🎉 Success Criteria

✅ PR merge edilebilir:

- Tüm checklist maddeleri ✅
- No critical issues
- Code review approved
- CI/CD pipeline green
- Documentation updated

---

## Tools

```bash
# Lint check
npm run lint

# Type check
npm run type-check  # veya tsc --noEmit

# Build
npm run build

# Test (varsa)
npm run test

# Circular dependency check
npx madge --circular --extensions ts,tsx src/
```

---

## FAQ

### Q: Component 200 satırdan uzun olabilir mi?
**A:** ⚠️ Mümkünse hayır. Refactor edin ve küçük component'lere bölün.

### Q: `any` kullanmam gerekirse ne yapmalıyım?
**A:** `unknown` kullanın ve type guard ile daraltın:
```typescript
function processData(data: unknown) {
  if (isProduct(data)) {
    // data artık Product type'ı
  }
}
```

### Q: Hook içinde direkt fetch() kullanabilir miyim?
**A:** ❌ Hayır. Önce API layer'da endpoint tanımlayın, sonra service'de çağırın.

### Q: OpenAPI'de olmayan field'ı API type'a ekleyebilir miyim?
**A:** ❌ Hayır. `types/domain/` altında ayrı type oluşturun.

---

**Golden Rule:** Şüphe ettiğinizde, katman kurallarına ve SSOT prensibine dön.
