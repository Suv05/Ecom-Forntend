import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart,fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
 
function ProductDetailsDialog({ open, setOpen, productDetails }) {

  const dispatch=useDispatch();
  const {user}=useSelector(state=>state.auth);
  const { toast }=useToast();
  const { cartItems } = useSelector((state) => state.shoppingCart);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-8 md:p-12 max-w-[90vw] md:max-w-[60vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl md:text-2xl mb-4 mt-2">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <StarIcon key={idx} className="w-5 h-5 fill-primary" />
                ))}
            </div>
            <span className="text-muted-foreground text-lg">4.5</span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator className="my-4" />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Subhashree</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array(5)
                      .fill(null)
                      .map((_, idx) => (
                        <StarIcon key={idx} className="w-5 h-5 fill-primary" />
                      ))}
                  </div>
                  <p className="text-muted-foreground">Awesome</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Input placeholder="Write a review..." />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
