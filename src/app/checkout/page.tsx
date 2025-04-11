"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .nonempty({ message: "Username is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().nonempty({ message: "Shipping Address is required." }),
  cardNumber: z
    .string()
    .min(16, { message: "Card number must be at least 16 digits." })
    .max(19, { message: "Card number can't exceed 19 digits." })
    .refine(
      (val) => {
        const digits = val.split("-").join("");
        return digits.length >= 16;
      },
      { message: "Please enter a valid card number." }
    ),
  cardExpirationDate: z.string().refine(
    (val) => {
      if (!/^\d{2}\/\d{2}$/.test(val)) return false;
      const [month, year] = val.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      return (
        parseInt(month) >= 1 &&
        parseInt(month) <= 12 &&
        (parseInt(year) > currentYear ||
          (parseInt(year) === currentYear && parseInt(month) >= currentMonth))
      );
    },
    { message: "Please enter a valid future expiration date (MM/YY)." }
  ),
  cardCvv: z
    .string()
    .min(3, { message: "CVV must be at least 3 digits." })
    .max(4, { message: "CVV can't exceed 4 digits." })
    .refine((val) => /^\d+$/.test(val), {
      message: "Please enter a valid CVV.",
    }),
});

const Checkout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { products, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserDetails = async () => {
    try {
      const response: AxiosResponse = await api.get(`/users/${user?.sub}`, {
        requiresAuth: false, // Move requiresAuth to the config root
      });
      if (response.data) {
        form.setValue("email", response.data.email);
      } else {
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error("failed while fetching user details");
      }
    }
  };

  useEffect(() => {
    if (user && user.sub) {
      fetchUserDetails();
    }
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "username",
      email: "email@email.com",
      address: "",
      cardExpirationDate: "",
      cardNumber: "",
      cardCvv: "",
    },
  });

  // Format expiration date as MM/YY
  const formatExpirationDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{0,2})/, "$1/$2")
      .substring(0, 5);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("go", { ...values, totalPrice: calculateTotal() });
    setIsLoading(true);
    clearCart();
    toast.success("Order placed successfully");
    setIsLoading(false);
    router.push("/");
  };

  const calculateTotal = () => {
    return products.reduce((acc, item) => {
      let subTotal = 0;
      if (item.quantity) {
        subTotal = item.price * item.quantity;
      }
      acc += subTotal;
      return acc;
    }, 0);
  };

  return (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-30 sm:pr-30 pt-5 pb-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="flex flex-row gap-5 px-0">
            <CardHeader className="w-[60%]">
              <CardTitle className="text-4xl">Secure Checkout</CardTitle>
              <div className="text-2xl font-bold">Shipping Information</div>
              <div>Username: {user?.user}</div>
              <div>Email: {form.getValues("email")}</div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Shipping Address"
                        {...field}
                        className="focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardContent className="px-0 text-2xl font-bold pt-5">
                Payment Information
              </CardContent>
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        type="card"
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        onChange={(e) => {
                          // Remove all non-digit characters
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          // Format with hyphens every 4 digits
                          const formatted = digitsOnly
                            .replace(/(\d{4})(?=\d)/g, "$1-")
                            .substring(0, 19); // 16 digits + 3 hyphens
                          field.onChange(formatted);
                        }}
                        maxLength={19}
                        className="focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Expiration Date Field */}
                  <FormField
                    control={form.control}
                    name="cardExpirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MM/YY"
                            {...field}
                            onChange={(e) => {
                              field.onChange(
                                formatExpirationDate(e.target.value)
                              );
                            }}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CVV Field */}
                  <FormField
                    control={form.control}
                    name="cardCvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            {...field}
                            type="password"
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardHeader>

            {/* Divider */}
            <div className="w-px bg-gray-300 h-auto mx-4 self-stretch" />

            <CardHeader className="w-[30%] px-0 mb-auto">
              <CardTitle className="text-2xl font-bold">
                Order Summary
              </CardTitle>
              <div className="pl-2">
                <div className="flex font-bold">
                  <div className="w-[85%]">Product</div>
                  <div className="ml-auto">Price</div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {products.map((product, index) => (
                    <div key={index} className="flex">
                      <div className="w-[85%]">
                        {product.title.slice(0, 30)}...(x{product.quantity})
                      </div>
                      {product.quantity && (
                        <div className="ml-auto">
                          ${product.price * product.quantity}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex pl-2">
                <div className="w-[85%] font-bold">Sub Total</div>
                <div className="ml-auto">${calculateTotal()}</div>
              </div>
              <Button type="submit" className="cursor-pointer">
                {isLoading && <LoaderCircle className="animate-spin-slow" />}
                Place Order
              </Button>
            </CardHeader>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Checkout;
