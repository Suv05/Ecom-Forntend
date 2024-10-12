import React, { useState, useEffect } from 'react';
import Address from '@/components/shopping-view/address';
import img from '../../assets/account.jpg';
import { useSelector, useDispatch } from 'react-redux';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router-dom';

function ShoppingCheckout() {
    const { cartItems } = useSelector((state) => state.shoppingCart);
    const { user } = useSelector((state) => state.auth);
    const { approvalURL } = useSelector((state) => state.shopOrder);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const [isCardElementReady, setIsCardElementReady] = useState(false);
    const navigate= useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (stripe && elements) {
            setIsCardElementReady(true);
        }
    }, [stripe, elements]);

    const totalCartAmount = cartItems?.items?.length > 0
        ? cartItems.items.reduce((sum, item) => sum + (item?.salePrice || item?.price) * item?.quantity, 0)
        : 0;

    async function handleInitialStripePayment() {
        setIsPaymentStart(true);
        if (cartItems.length === 0) {
            toast({ title: "Your cart is empty. Please add items to proceed.", variant: "destructive" });
            setIsPaymentStart(false);
            return;
        }
        if (!currentSelectedAddress) {
            toast({ title: "Please select an address to proceed.", variant: "destructive" });
            setIsPaymentStart(false);
            return;
        }
        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map(item => ({
                productId: item?.productId,
                title: item?.title,
                image: item?.image,
                price: item?.salePrice || item?.price,
                quantity: item?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                postalCode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: "pending",
            paymentMethod: "stripe",
            paymentStatus: "pending",
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
        };
      console.log(orderData);
        try {
            const response = await dispatch(createNewOrder(orderData));
            const { payload } = response;
            if (payload.success) {
                const { clientSecret } = payload;
                const cardElement = elements.getElement(CardElement);
                if (!cardElement) {
                    throw new Error("Card element not found");
                }
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: user?.name,
                            email: user?.email,
                             address :{
                                postal_code: currentSelectedAddress?.pincode
                            }
                            
                        },
                    },
                });
                if (result.error) {
                    toast({ title: `Payment failed: ${result.error.message}`, variant: "destructive" });
                } else if (result.paymentIntent.status === "succeeded") {
                    navigate('/shop/stripe-return')
                    toast({ title: "Payment successful!", variant: "positive" });
                }
            } else {
                toast({ title: "Order creation failed. Please try again.", variant: "destructive" });
            }
        } catch (error) {
            console.error('Error during payment process:', error);
            toast({ title: `An error occurred: ${error.message}`, variant: "destructive" });
        } finally {
            setIsPaymentStart(false);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[700px] w-full overflow-hidden">
                <img src={img} className='h-full w-full object-cover object-center' alt="Account" />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5'>
                <Address setCurrentSelectedAddress={setCurrentSelectedAddress} currentSelectedAddress={currentSelectedAddress} />
                <div className='flex flex-col gap-4'>
                    {cartItems && cartItems.items?.length > 0
                        ? cartItems.items.map(item => (
                            <UserCartItemsContent key={item.productId} cartItem={item} />
                        ))
                        : null}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalCartAmount}</span>
                        </div>
                    </div>
                    <label className="block text-bold-700 mt-4">Enter your credit card details:</label>
                    <div className=" p-3 border rounded">
                        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                    </div>
                    <div>
                        <Button
                            className="mt-3 w-full"
                            onClick={handleInitialStripePayment}
                            disabled={!stripe || !elements || isPaymentStart || !isCardElementReady}>
                            {isPaymentStart ? "Processing..." : "Checkout Payment"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;
