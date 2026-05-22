"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Laptop, 
  ShoppingBag, 
  Users, 
  ClipboardList, 
  DollarSign,
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Info,
  ChevronRight,
  TrendingUp,
  Inbox
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  reviewUsedLaptopRequest, 
  updateOrderStatus 
} from "@/app/actions/laptop-actions"
import { OrderStatus } from "@prisma/client"

interface AdminDashboardProps {
  products: any[]
  orders: any[]
  requests: any[]
  users: any[]
  categories: any[]
  brands: any[]
  locale: string
}

export function AdminDashboard({
  products: initialProducts,
  orders: initialOrders,
  requests: initialRequests,
  users,
  categories,
  brands,
  locale
}: AdminDashboardProps) {
  const isAr = locale === "ar"
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders" | "requests" | "users">("analytics")
  
  // Local state for CRUD updates
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [requests, setRequests] = useState(initialRequests)

  // Dialog / Form States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  
  // Product Form Fields
  const [name, setName] = useState("")
  const [nameAr, setNameAr] = useState("")
  const [description, setDescription] = useState("")
  const [descAr, setDescAr] = useState("")
  const [price, setPrice] = useState(999)
  const [condition, setCondition] = useState("NEW")
  const [stock, setStock] = useState(10)
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
  const [brandId, setBrandId] = useState(brands[0]?.id || "")
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
  ])
  const [newImageUrl, setNewImageUrl] = useState("")

  // Search Filter
  const [searchTerm, setSearchTerm] = useState("")

  // Analytics helper calculations
  const totalSales = orders.filter(o => o.paymentStatus === "PAID" || o.paymentStatus === "DEPOSIT_PAID").reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingRequests = requests.filter(r => r.status === "PENDING").length

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description || !price || !categoryId || !brandId || images.length === 0) {
      toast.error(isAr ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields")
      return
    }

    const res = await createProduct({
      name,
      nameAr: nameAr || name,
      description,
      descAr: descAr || description,
      price: Number(price),
      condition,
      stock: Number(stock),
      categoryId,
      brandId,
      images
    })

    if (res.success) {
      toast.success(isAr ? "تم إنشاء المنتج بنجاح!" : "Product created successfully!")
      setIsCreateOpen(false)
      // Quick refresh simulation or real state addition
      setProducts([
        {
          id: res.productId,
          name,
          nameAr: nameAr || name,
          description,
          descAr: descAr || description,
          price: Number(price),
          condition,
          stock: Number(stock),
          category: categories.find(c => c.id === categoryId),
          brand: brands.find(b => b.id === brandId),
          images: images.map((url, i) => ({ id: `img-${i}`, url }))
        },
        ...products
      ])
      // Reset form
      setName("")
      setNameAr("")
      setDescription("")
      setDescAr("")
      setPrice(999)
      setStock(10)
    } else {
      toast.error(res.error || "Failed to create product")
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const res = await updateProduct(editingProduct.id, {
      name,
      nameAr: nameAr || name,
      description,
      descAr: descAr || description,
      price: Number(price),
      condition,
      stock: Number(stock),
      categoryId,
      brandId,
      images
    })

    if (res.success) {
      toast.success(isAr ? "تم تعديل المنتج بنجاح!" : "Product updated successfully!")
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        name,
        nameAr: nameAr || name,
        description,
        descAr: descAr || description,
        price: Number(price),
        condition,
        stock: Number(stock),
        categoryId,
        brandId,
        category: categories.find(c => c.id === categoryId),
        brand: brands.find(b => b.id === brandId),
        images: images.map((url, i) => ({ id: `img-${i}`, url }))
      } : p))
      setEditingProduct(null)
    } else {
      toast.error(res.error || "Failed to update product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا المنتج نهائياً؟" : "Are you sure you want to permanently delete this product?")) return

    const res = await deleteProduct(id)
    if (res.success) {
      toast.success(isAr ? "تم حذف المنتج بنجاح!" : "Product deleted successfully!")
      setProducts(products.filter(p => p.id !== id))
    } else {
      toast.error(res.error || "Failed to delete product")
    }
  }

  const handleReviewRequest = async (id: string, status: "APPROVED" | "REJECTED") => {
    const res = await reviewUsedLaptopRequest(id, status)
    if (res.success) {
      toast.success(
        status === "APPROVED" 
          ? (isAr ? "تمت الموافقة على الطلب وإضافته للمتجر!" : "Request approved and listed in the catalog!")
          : (isAr ? "تم رفض الطلب بنجاح" : "Request rejected successfully")
      )
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r))
    } else {
      toast.error(res.error || "Failed to process request")
    }
  }

  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(orderId, newStatus)
    if (res.success) {
      toast.success(isAr ? "تم تحديث حالة الطلب بنجاح!" : "Order status updated successfully!")
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } else {
      toast.error(res.error || "Failed to update order status")
    }
  }

  const openEditModal = (p: any) => {
    setEditingProduct(p)
    setName(p.name)
    setNameAr(p.nameAr || "")
    setDescription(p.description)
    setDescAr(p.descAr || "")
    setPrice(p.price)
    setCondition(p.condition)
    setStock(p.stock)
    setCategoryId(p.categoryId)
    setBrandId(p.brandId)
    setImages(p.images.map((img: any) => img.url))
  }

  const addImageUrl = () => {
    if (!newImageUrl.startsWith("http")) {
      toast.error(isAr ? "رابط الصورة غير صحيح" : "Invalid image URL")
      return
    }
    setImages([...images, newImageUrl])
    setNewImageUrl("")
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.nameAr && p.nameAr.includes(searchTerm))
  )

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cyan-500/10 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {isAr ? "لوحة التحكم للمشرفين" : "Admin Panel"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAr ? "إدارة المنتجات، المستخدمين، الطلبات ومراجعة الأجهزة المستعملة." : "Manage products, users, orders, and review used device requests."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              // Reset values to defaults
              setName("")
              setNameAr("")
              setDescription("")
              setDescAr("")
              setPrice(999)
              setCondition("NEW")
              setStock(10)
              setCategoryId(categories[0]?.id || "")
              setBrandId(brands[0]?.id || "")
              setImages(["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"])
              setIsCreateOpen(true)
            }} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
          >
            <Plus className="h-5 w-5 mr-1 rtl:ml-1 rtl:mr-0" />
            {isAr ? "إضافة لابتوب جديد" : "Add New Laptop"}
          </Button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cyan-500/10 pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "analytics" 
              ? "bg-cyan-600 text-white shadow-lg" 
              : "text-muted-foreground hover:bg-cyan-500/5 hover:text-cyan-500"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          {isAr ? "الإحصائيات العامة" : "Overview"}
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "products" 
              ? "bg-cyan-600 text-white shadow-lg" 
              : "text-muted-foreground hover:bg-cyan-500/5 hover:text-cyan-500"
          }`}
        >
          <Laptop className="h-4 w-4" />
          {isAr ? "إدارة اللابتوبات" : "Manage Laptops"}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "orders" 
              ? "bg-cyan-600 text-white shadow-lg" 
              : "text-muted-foreground hover:bg-cyan-500/5 hover:text-cyan-500"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {isAr ? "إدارة الطلبات" : "Manage Orders"}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "requests" 
              ? "bg-cyan-600 text-white shadow-lg" 
              : "text-muted-foreground hover:bg-cyan-500/5 hover:text-cyan-500"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          {isAr ? "طلبات بيع المستعمل" : "Used Laptop Requests"}
          {pendingRequests > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {pendingRequests}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "users" 
              ? "bg-cyan-600 text-white shadow-lg" 
              : "text-muted-foreground hover:bg-cyan-500/5 hover:text-cyan-500"
          }`}
        >
          <Users className="h-4 w-4" />
          {isAr ? "المستخدمين" : "Users List"}
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Analytics Cards Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-cyan-500/10 bg-cyan-500/[0.01] backdrop-blur-sm shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isAr ? "إجمالي المبيعات" : "Total Revenue"}
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-cyan-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground">${totalSales.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">{isAr ? "من الطلبات المدفوعة" : "From completed payments"}</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/10 bg-cyan-500/[0.01] backdrop-blur-sm shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isAr ? "الطلبات المستلمة" : "Total Orders"}
                    </CardTitle>
                    <ShoppingBag className="h-5 w-5 text-cyan-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground mt-1">{isAr ? "إجمالي الطلبات المنشأة" : "Overall order volume"}</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/10 bg-cyan-500/[0.01] backdrop-blur-sm shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isAr ? "المنتجات في المتجر" : "Total Laptops"}
                    </CardTitle>
                    <Laptop className="h-5 w-5 text-cyan-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground mt-1">{isAr ? "أجهزة معروضة حالياً" : "Active laptop listings"}</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/10 bg-cyan-500/[0.01] backdrop-blur-sm shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {isAr ? "طلبات مستعمل معلقة" : "Pending Reviews"}
                    </CardTitle>
                    <ClipboardList className="h-5 w-5 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-foreground text-red-400">{pendingRequests}</div>
                    <p className="text-xs text-muted-foreground mt-1">{isAr ? "تنتظر مراجعة المشرف" : "Needs review decisions"}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Fast Activity List */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="border-cyan-500/10 bg-background/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{isAr ? "أحدث الطلبات" : "Recent Orders Activity"}</CardTitle>
                    <CardDescription>{isAr ? "تابع حالة شحن وتوصيل الطلبات للعملاء" : "Check the shipping status updates"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b border-cyan-500/5 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-bold truncate">#{order.id.slice(-6)} - {order.user.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-cyan-500/20 text-cyan-400 font-bold">
                            ${order.total}
                          </Badge>
                          <Badge className={
                            order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500" :
                            order.status === "DELIVERING" ? "bg-cyan-500/10 text-cyan-500" :
                            "bg-amber-500/10 text-amber-500"
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/10 bg-background/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{isAr ? "أحدث طلبات بيع المستعمل" : "Recent Used Device Submissions"}</CardTitle>
                    <CardDescription>{isAr ? "المستخدمين الذين يرغبون ببيع أجهزتهم" : "Used laptops waiting for approval"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {requests.slice(0, 4).map((req) => (
                      <div key={req.id} className="flex items-center justify-between border-b border-cyan-500/5 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-bold">{req.brand} {req.model}</p>
                          <p className="text-xs text-muted-foreground">{req.user.name}</p>
                        </div>
                        <Badge className={
                          req.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                          req.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                          "bg-red-500/10 text-red-500"
                        }>
                          {req.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Product Filtering Toolbar */}
              <div className="flex max-w-md">
                <Input
                  placeholder={isAr ? "ابحث باسم اللابتوب..." : "Search laptops catalog..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-cyan-500/10 focus:border-cyan-500/40"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-cyan-500/10 bg-background/30 backdrop-blur-md">
                <table className="w-full text-left text-sm rtl:text-right">
                  <thead className="bg-cyan-500/5 text-xs uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">{isAr ? "اللابتوب" : "Laptop"}</th>
                      <th className="px-6 py-4">{isAr ? "البراند" : "Brand"}</th>
                      <th className="px-6 py-4">{isAr ? "التصنيف" : "Category"}</th>
                      <th className="px-6 py-4">{isAr ? "السعر" : "Price"}</th>
                      <th className="px-6 py-4">{isAr ? "الحالة" : "Condition"}</th>
                      <th className="px-6 py-4">{isAr ? "المخزن" : "Stock"}</th>
                      <th className="px-6 py-4 text-center">{isAr ? "الخيارات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/5">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-cyan-500/[0.02]">
                        <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={product.images[0]?.url || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"} 
                            alt="" 
                            className="h-10 w-10 rounded-lg object-cover" 
                          />
                          <span className="truncate max-w-[150px]">{isAr && product.nameAr ? product.nameAr : product.name}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{product.brand.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{isAr && product.category.nameAr ? product.category.nameAr : product.category.name}</td>
                        <td className="px-6 py-4 font-bold text-cyan-400">${product.price}</td>
                        <td className="px-6 py-4">
                          <Badge className={product.condition === "NEW" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}>
                            {product.condition}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{product.stock}</td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <Button 
                            onClick={() => openEditModal(product)} 
                            size="icon" 
                            variant="ghost" 
                            className="text-cyan-500 hover:bg-cyan-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteProduct(product.id)} 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="overflow-x-auto rounded-2xl border border-cyan-500/10 bg-background/30 backdrop-blur-md">
                <table className="w-full text-left text-sm rtl:text-right">
                  <thead className="bg-cyan-500/5 text-xs uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">{isAr ? "رقم الطلب" : "Order ID"}</th>
                      <th className="px-6 py-4">{isAr ? "العميل" : "Customer"}</th>
                      <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
                      <th className="px-6 py-4">{isAr ? "الإجمالي" : "Total"}</th>
                      <th className="px-6 py-4">{isAr ? "الدفع" : "Payment"}</th>
                      <th className="px-6 py-4">{isAr ? "حالة التوصيل" : "Delivery Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/5">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-cyan-500/[0.02]">
                        <td className="px-6 py-4 font-bold text-foreground">#{order.id.slice(-8)}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.user.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-extrabold text-cyan-400">${order.total}</td>
                        <td className="px-6 py-4">
                          <Badge className={
                            order.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-500" :
                            "bg-amber-500/10 text-amber-500"
                          }>
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="bg-background rounded-md border border-cyan-500/10 p-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="DELIVERING">DELIVERING</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {requests.map((req) => (
                  <Card key={req.id} className="border-cyan-500/10 bg-background/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={req.images[0] || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"} 
                        alt="" 
                        className="h-16 w-16 rounded-xl object-cover border border-cyan-500/20" 
                      />
                      <div>
                        <CardTitle className="text-lg font-bold">{req.brand} {req.model}</CardTitle>
                        <CardDescription>{isAr ? "مقدم من: " : "Submitted by: "} <span className="font-semibold text-foreground">{req.user.name}</span></CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        <Badge className={
                          req.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                          req.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                          "bg-red-500/10 text-red-500"
                        }>
                          {req.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 rounded-xl bg-cyan-500/[0.01] border border-cyan-500/5 p-3 text-sm">
                        <p className="font-bold text-xs text-cyan-500">{isAr ? "الحالة المذكورة:" : "Condition:"} {req.condition}</p>
                        <p className="text-muted-foreground leading-relaxed">{req.specs}</p>
                      </div>
                      
                      {req.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto py-1">
                          {req.images.map((img: string, i: number) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={img} alt="" className="h-10 w-14 rounded object-cover border" />
                          ))}
                        </div>
                      )}
                    </CardContent>
                    {req.status === "PENDING" && (
                      <CardFooter className="flex gap-4 border-t border-cyan-500/5 pt-4">
                        <Button 
                          onClick={() => handleReviewRequest(req.id, "APPROVED")} 
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                          size="sm"
                        >
                          <Check className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                          {isAr ? "موافقة وإدراج بالمتجر" : "Approve & List"}
                        </Button>
                        <Button 
                          onClick={() => handleReviewRequest(req.id, "REJECTED")} 
                          variant="outline" 
                          className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/5"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                          {isAr ? "رفض الطلب" : "Reject"}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}

                {requests.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-cyan-500/10">
                    <Inbox className="h-12 w-12 text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground">{isAr ? "لا توجد طلبات معلقة لمراجعتها حالياً." : "No laptop submission requests to review."}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="overflow-x-auto rounded-2xl border border-cyan-500/10 bg-background/30 backdrop-blur-md">
                <table className="w-full text-left text-sm rtl:text-right">
                  <thead className="bg-cyan-500/5 text-xs uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">{isAr ? "الاسم" : "Name"}</th>
                      <th className="px-6 py-4">{isAr ? "الإيميل" : "Email"}</th>
                      <th className="px-6 py-4">{isAr ? "الصلاحية" : "Role"}</th>
                      <th className="px-6 py-4">{isAr ? "تاريخ التسجيل" : "Joined"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/5">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-cyan-500/[0.02]">
                        <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                          <span className="h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-500 font-bold flex items-center justify-center text-xs">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4">
                          <Badge className={
                            user.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-cyan-500/10 text-cyan-500"
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CREATE & EDIT MODALS / DIALOGS */}
      {(isCreateOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl rounded-3xl border border-cyan-500/20 bg-background p-6 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {isCreateOpen 
                  ? (isAr ? "إضافة لابتوب جديد" : "Add New Laptop") 
                  : (isAr ? "تعديل بيانات اللابتوب" : "Edit Laptop Info")}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setIsCreateOpen(false)
                  setEditingProduct(null)
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={isCreateOpen ? handleCreateProduct : handleEditProduct} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isAr ? "اسم اللابتوب (إنجليزي)" : "Laptop Name (EN)"}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "اسم اللابتوب (عربي)" : "Laptop Name (AR)"}</Label>
                  <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isAr ? "الوصف (إنجليزي)" : "Description (EN)"}</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "الوصف (عربي)" : "Description (AR)"}</Label>
                  <Input value={descAr} onChange={(e) => setDescAr(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{isAr ? "السعر ($)" : "Price ($)"}</Label>
                  <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "المخزن" : "Stock"}</Label>
                  <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "الحالة" : "Condition"}</Label>
                  <select 
                    value={condition} 
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-lg border border-cyan-500/10 bg-background p-2 text-sm focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="USED">USED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isAr ? "البراند" : "Brand"}</Label>
                  <select 
                    value={brandId} 
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full rounded-lg border border-cyan-500/10 bg-background p-2 text-sm focus:outline-none"
                  >
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{isAr ? "التصنيف" : "Category"}</Label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-lg border border-cyan-500/10 bg-background p-2 text-sm focus:outline-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{isAr && c.nameAr ? c.nameAr : c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.01] p-3">
                <Label>{isAr ? "صور المنتج" : "Product Images"}</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://example.com/laptop-image.jpg" 
                    value={newImageUrl} 
                    onChange={(e) => setNewImageUrl(e.target.value)} 
                  />
                  <Button type="button" onClick={addImageUrl} size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                    {isAr ? "إضافة" : "Add"}
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="object-cover w-full h-full" />
                      <button 
                        type="button" 
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-cyan-500/10">
                <Button 
                  type="submit" 
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                >
                  {isAr ? "حفظ البيانات" : "Save Changes"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateOpen(false)
                    setEditingProduct(null)
                  }}
                  className="flex-1 border-cyan-500/10 hover:bg-cyan-500/5 text-muted-foreground"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
