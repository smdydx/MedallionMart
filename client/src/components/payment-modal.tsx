
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Smartphone, Building } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentData: any) => void;
}

export default function PaymentModal({ isOpen, onClose, total, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "wallet", name: "Digital Wallet", icon: Wallet },
    { id: "netbanking", name: "Net Banking", icon: Building },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentData = {
      method: paymentMethod,
      amount: total,
      transactionId: `TXN${Date.now()}`,
      status: "success"
    };
    
    setIsProcessing(false);
    onPaymentComplete(paymentData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">₹{total}</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={paymentMethod === method.id ? "default" : "outline"}
                    className="h-16 flex flex-col gap-1"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Payment Forms */}
          {paymentMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {paymentMethod === "upi" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {paymentMethod === "wallet" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paytm">Paytm</SelectItem>
                  <SelectItem value="phonepe">PhonePe</SelectItem>
                  <SelectItem value="googlepay">Google Pay</SelectItem>
                  <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {paymentMethod === "netbanking" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank</SelectItem>
                  <SelectItem value="icici">ICICI Bank</SelectItem>
                  <SelectItem value="axis">Axis Bank</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay ₹${total}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
