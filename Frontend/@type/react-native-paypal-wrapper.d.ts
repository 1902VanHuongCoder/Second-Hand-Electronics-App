declare module 'react-native-paypal-wrapper' {
    export function paymentRequest(options: {
        clientId: string;
        environment: 'sandbox' | 'production';
        intent: 'sale' | 'authorize' | 'order';
        price: number; // Hoặc string, tùy thuộc vào cách bạn sử dụng
        currency: string;
        shortDescription: string;
    }): Promise<{ state: string }>;
}