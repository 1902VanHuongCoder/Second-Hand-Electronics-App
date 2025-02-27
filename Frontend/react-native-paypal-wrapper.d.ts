declare module 'react-native-paypal-wrapper' {
    export function paymentRequest(options: {
        clientId: string;
        environment: 'sandbox' | 'production';
        intent: 'sale' | 'authorize' | 'order';
        price: string;
        currency: string;
        shortDescription: string;
    }): Promise<{ state: string }>;
}