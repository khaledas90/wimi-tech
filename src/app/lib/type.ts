import { StaticImageData } from "next/image";
export interface ApiResponse<T> {
  statusCode: number;
  meta: string | null;
  succeeded: boolean;
  message: string;
  errors: string | null;
  data: T;
  status?: number;
}

////////// field form

export interface FieldForm {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "select"
    | "password"
    | "phoneNumber"
    | "url"
    | "file";
  options?: string[];
  fetchUrl?: string;
  placeholder?: string;
  requierd?: boolean;
  maxLength?: number;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
}

////////// field form

////login
export interface Login {
  email: string;
  password: string;
}
////login

//////card type
export interface Product {
  id: number;
  category_id: number;
  category: string;
  offer: number;
}

export interface main_screen_Product {
  _id: string;
  title: string;
  traderId: Trader;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface gethome {
  products: main_screen_Product[];
  pagination: Pagination;
}
export interface CardProps {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  traderId?: Trader;

  // خصائص إضافية لعرض البطاقة
  love?: boolean;
  soldOut?: boolean;
  reviews_avg?: number;
  originalPrice?: number;
  discount?: number;
  packet_price?: number;
  packet_price_after_offer?: number;
  packet_pieces?: number;
  piece_price_after_offer?: number;
  handellove?: () => void;
}

///card type

///category type

export interface CategoryProps {
  id: number;
  image: string | StaticImageData;
  name: string;
  products_count?: number;
}
///category type

///// slider type

export interface ProductSliderItem {
  id: number;
  title?: string;
  image: string;
  product_id?: number;
  product?: Product;
}

export interface SwiperSliderProps {
  items: ProductSliderItem[];
  height?: string;
  objectFit?: "cover" | "contain";
  showNavigation?: boolean;
  showPagination?: boolean;
  autoPlayDelay?: number;
}

///// slider type

///CategoryWithProducts type
export interface CategoryWithProducts {
  id: number;
  name: string;
  image: string;
  products_count: number;
  products: CardProps[];
}

///CategoryWithProducts type

// home type
export interface HomePageData {
  sliders: ProductSliderItem[];
  hotDeals: CardProps[];
  topSelling: CardProps[];
  categoriesWithProducts: CategoryWithProducts[];
  categories: CategoryProps[];
}
// home type

export interface acesstoken {
  accessToken: string;
  expires: string;
  tokenType: string;
  scope: string;
  idToken: string;
  sessionState: string;
  user: {
    name: string;
    email: string;
    image?: string;
    sub?: string;
  };
}

/// state managment
export interface HomeDataState {
  data: HomePageData;
  loadingdata: boolean;
  fetchHomeData: () => Promise<void>;
}

//// pagination
export interface ProductsState {
  products: CardProps[];
  page: number;
  lastPage: number;
  loading: boolean;
  hasMore: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchProducts: (reset?: boolean, search?: string) => Promise<void>;
}

/// sign in
export interface SignIn {
  phoneNumber: string;
  password: string;
}

export interface User {
  phoneNumber: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface registerres {
  token?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

/// product id
export interface Trader {
  _id: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  lastName?: string;
  createdAt?: string;
  orders: Ordershoping[];
}

export interface Product {
  _id: string;
  title: string;
  traderId: Trader;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
}

/////////////register
export interface signup_user {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  token?: string;
}
//// create product

export interface Creatproduct {
  title: string;
  description: string;
  price: string;
  category: string;
  stockQuantity?: string;
  quantity?: number;
  images: string | File[];
  phoneNumber: string;
}

//// create order

export interface CreateOrder {
  productId: string;
  quantity: number;
  totalPrice: number;
}

export interface getproduct {
  _id: number;
  title: string;
  traderId: Trader;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
}
export interface updateproduct {
  title: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
}
export interface AddFavorit {
  productId: string;
}

// types.ts
export interface Productshoping {
  _id: string;
  title: string;
  traderId: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
}

export interface Ordershoping {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  __v: number;
  status?: string;
  paymentState?: string;
}

export interface CartAndOrdersResponseshoping {
  cart: Productshoping[];
  orders: Ordershoping[];
}

export interface ProductWithType {
  _id: string;
  title: string;
  traderId: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
  type: "cart" | "order";
  cartLength?: number;
}

export interface OrderItem {
  _id: string;
  userId: string;
  productId: string;
  traderId: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"; // أو أي حالات أخرى عندك
  paymentState: "Pending" | "Paid" | "Failed"; // حسب حالتك
  orderDate: string;
  __v: number;
}

export interface Serach {
  products: main_screen_Product[];
  pagination: Pagination;
}
export interface wordsearch {
  text: string;
}

export interface WeeklySalesReport {
  success: boolean;
  message: string;
  data: {
    totalSales: number;
    totalOrders: number;
    orders: Orderreport[];
  };
}

export interface Orderreport {
  _id: string;
  userId: Userreport;
  productId: Productreport | null;
  traderId: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Completed" | "Cancelled";
  paymentState: "Pending" | "Paid" | "Failed";
  orderDate: string;
  __v: number;
}

export interface Userreport {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  __v: number;
}

export interface Productreport {
  _id: string;
  title: string;
  traderId: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
}

//// admin pannel

export interface Main_Admin_pannel {
  totalUsers: number;
  waitingTraders: number;
  totalOrders: number;
  totalEarnings: string;
  adminEarnings: string;
  tradersEarnings: string;
}

/////////users admin pannel
export interface Users_admin_pannel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  __v: 0;
}

export interface traders_admin_pannel extends Users_admin_pannel {
  address: string;
  googleMapLink: string;
  block: boolean;
  verify: boolean;
}
export interface ResponseData {
  users: Users_admin_pannel[];
  traders: traders_admin_pannel[];
  pagination: {
    page?: number;
    limit?: number;
    totalUsers?: number;
    totalTraders?: number;
    totalUserPages: number;
    totalTraderPages: number;
  };
}
//////// post users or traders admin pannel

export interface User_waiting {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  verify: boolean;
  address: string;
  googleMapLink: string;
  block: boolean;
  waiting: boolean;
  createdAt: string;
  __v: number;
  pagination: Pagination;
}
///////////////

export interface Traderprofits {
  traderName: string;
  traderId: string;
  phoneNumber: number;
  totalProfit: number;
}
export interface Total_Profits {
  platformProfit: number;
}

export interface Send_Notification {
  type: string;
  text: string;
  userId: string;
}
export interface userNotigication {
  _id: string;
  type: string;
  userId: string;
  text: string;
  createdAt: string;
  __v: 0;
}

// Order Details Types
export interface OrderItem {
  title: string;
  phoneNumber: string;
  description: string;
  price: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  _id: string;
  order_id: string;
}

export interface OrderDetails {
  _id: string;
  traderId: string;
  orders: OrderItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderDetailsResponse {
  success: boolean;
  message: string;
  data: OrderDetails;
}
