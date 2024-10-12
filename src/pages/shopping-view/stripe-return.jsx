import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearCart } from "@/store/shop/cart-slice";

function PaymentSuccessPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleGoHome = () => {
    navigate("/shop/home"); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-green-500 text-lg mb-4">
            Thank you for your payment! Your order has been successfully processed.
          </div>
          <button
            onClick={handleGoHome}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Continue Shopping
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
