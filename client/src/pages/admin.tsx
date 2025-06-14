import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Package, Tag, Users, ShoppingCart } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    categoryId: "",
    featured: false,
    flashDeal: false,
    discountPercentage: 0,
    tags: "",
    deliveryTime: "Standard",
    inStock: true
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "",
    color: "",
    description: ""
  });

  // Fetch data
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          price: data.price.toString(),
          originalPrice: data.originalPrice || null,
          categoryId: parseInt(data.categoryId),
          tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
          reviewCount: 0,
          rating: "0"
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      setProductForm({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        image: "",
        categoryId: "",
        featured: false,
        flashDeal: false,
        discountPercentage: 0,
        tags: "",
        deliveryTime: "Standard",
        inStock: true
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
      setCategoryForm({
        name: "",
        icon: "",
        color: "",
        description: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">You don't have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}! Manage your ecommerce platform.</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Tag className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured Items</p>
                  <p className="text-2xl font-bold text-gray-900">{products.filter((p: any) => p.featured).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Flash Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{products.filter((p: any) => p.flashDeal).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No products found. Create your first product!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product: any) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="aspect-video bg-gray-200 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xl font-bold text-orange-600">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {product.featured && <Badge variant="secondary">Featured</Badge>}
                              {product.flashDeal && <Badge variant="destructive">Flash Deal</Badge>}
                              {product.inStock ? (
                                <Badge variant="outline" className="text-green-600">In Stock</Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-600">Out of Stock</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category: any) => (
                      <Card key={category.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                              <i className={`${category.icon} text-${category.color}-600 text-xl`}></i>
                            </div>
                            <div>
                              <h3 className="font-semibold">{category.name}</h3>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Add Category Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add New Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createCategoryMutation.mutate(categoryForm);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            placeholder="e.g., Electronics"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="categoryIcon">Icon Class</Label>
                          <Input
                            id="categoryIcon"
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                            placeholder="e.g., fas fa-mobile-alt"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="categoryColor">Color</Label>
                          <Select
                            value={categoryForm.color}
                            onValueChange={(value) => setCategoryForm({ ...categoryForm, color: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="pink">Pink</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="categoryDescription">Description</Label>
                          <Input
                            id="categoryDescription"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={createCategoryMutation.isPending}>
                        {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createProductMutation.mutate(productForm);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select
                        value={productForm.categoryId}
                        onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price (₹)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productOriginalPrice">Original Price (₹)</Label>
                      <Input
                        id="productOriginalPrice"
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productImage">Image URL</Label>
                      <Input
                        id="productImage"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Select
                        value={productForm.deliveryTime}
                        onValueChange={(value) => setProductForm({ ...productForm, deliveryTime: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Same Day">Same Day</SelectItem>
                          <SelectItem value="Express">Express (1-2 days)</SelectItem>
                          <SelectItem value="Standard">Standard (3-5 days)</SelectItem>
                          <SelectItem value="Free Shipping">Free Shipping (5-7 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Enter product description"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="productTags">Tags (comma separated)</Label>
                    <Input
                      id="productTags"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                      placeholder="e.g., wireless, premium, electronics"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="flashDeal"
                        checked={productForm.flashDeal}
                        onChange={(e) => setProductForm({ ...productForm, flashDeal: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="flashDeal">Flash Deal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>
                  </div>

                  {productForm.flashDeal && (
                    <div>
                      <Label htmlFor="discountPercentage">Discount Percentage</Label>
                      <Input
                        id="discountPercentage"
                        type="number"
                        value={productForm.discountPercentage}
                        onChange={(e) => setProductForm({ ...productForm, discountPercentage: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={createProductMutation.isPending} className="w-full">
                    {createProductMutation.isPending ? "Creating Product..." : "Create Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}