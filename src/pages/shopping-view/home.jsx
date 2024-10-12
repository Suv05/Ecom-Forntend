import { Button } from '@/components/ui/button'
import  bannerone from '../../assets/banner1.jpg'
import  bannerTwo from '../../assets/banner2.jpg'
import  bannerThree from '../../assets/banner3.jpg'
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Airplay,
    BabyIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    CloudLightning,
    Heater,
    Images,
    Shirt,
    ShirtIcon,
    ShoppingBasket,
    UmbrellaIcon,
    WashingMachine,
    WatchIcon,
  } from "lucide-react";
import ShoppingProductTitle from "@/components/shopping-view/product-title";
import { useDispatch,useSelector } from 'react-redux';
import {fetchAllFilteredProducts,fetchProductDetails } from "@/store/shop/products-slice";
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from '@/components/ui/use-toast';
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];
const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
  ];

function shoppingHome(){

  const slides = [
    {
      image: bannerone,
      title: "Explore Our Latest Collection",
      description: "Browse our wide range of clothing, footwear, and accessories for all seasons and styles.",
    },
    {
      image: bannerTwo,
      title: "Unbeatable Deals Just for You",
      description: "Shop now and take advantage of exclusive discounts on your favorite brands and products.",
    },
    {
      image: bannerThree,
      title: "Shop Quality at Affordable Prices",
      description: "Get the best value for your money with top-quality items across all categories.",
    },
  ];  
    const [currentSlide,setCurrentSlide]=useState(0);
    const dispatch=useDispatch();
    const navigate= useNavigate();
    const { productList, productDetails } = useSelector(
        (state) => state.shopProducts);
    const { user } = useSelector((state)=>state.auth)
    const {toast}= useToast();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
          [section]: [getCurrentItem.id],
        };
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate(`/shop/listing`);
      }
      function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
      }
     
      function handleAddtoCart(getCurrentProductId) {
        dispatch(
          addToCart({
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: 1,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchCartItems(user?.id));
            toast({
              title: "Product is added to cart",
            });
          }
        });
      }

    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000);  
        return () => clearInterval(timer);
      }, []); 

    useEffect(() => {
        dispatch(
          fetchAllFilteredProducts({
            filterParams: {},
            sortParams: "price-lowtohigh",
          })
        );
      }, [dispatch]); 
    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
      }, [productDetails]);    
    
      console.log(productDetails,productList)

    return(
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-0 pb-[56.25%] overflow-hidden">
            {slides.map((slide, index) => (
      <div
        key={index}
        className={`${
          index === currentSlide ? "opacity-100" : "opacity-0"
        } absolute top-0 left-0 w-full h-full transition-opacity duration-1000 `}  
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-end p-4 sm:p-8 bg-black bg-opacity-50 text-white" style={{ zIndex: 2 }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl">{slide.title}</h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg">{slide.description}</p>
        
        </div>
   </div>
    ))}
     <Button 
    variant="outline" 
    size="icon"
    onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 p-1 rounded-full 
               sm:left-6 sm:p-2 md:left-8 md:p-3">
    <ChevronsLeftIcon className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' />
</Button>

<Button 
    variant="outline" 
    size="icon"
    onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1 + slides.length) % slides.length)}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 p-1 rounded-full 
               sm:right-6 sm:p-2 md:right-8 md:p-3">
    <ChevronsRightIcon className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' />
</Button>
            </div>

            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className=' flex justify-center text-3xl font-bold mb-8 '> Shop by Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card 
              key={categoryItem.id}
              className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() =>
                handleNavigateToListingPage(categoryItem, "category")
              }>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
              </div>
            </section>

            <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
              key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTitle
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={() => handleAddtoCart(productItem._id)}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div> 
        

    )
}
export default shoppingHome