import { IPayment } from "@/models/paymentModel";

export const fetchPayments = async (): Promise<IPayment[]> => {
    try {
        const response = await fetch("/api/payments", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch a payments.");
        }

        const payments: IPayment[] = await response.json();
        return payments;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred.");
    }
}

export const createPayment = async (data: {senderAccountNumber: string; receiverAccountNumber: string; amount: number;}): Promise<IPayment> => {
    try {
        const response = await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create a payment.");
        }

        const newPayment: IPayment = await response.json();
        return newPayment;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred.");
    }
}