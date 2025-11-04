// import { baseApi } from "../baseApi";



// export const feaFaqs = baseApi.injectEndpoints({
//     endpoints:(builder)=>({
//         // Placeholder for future endpoints
//     getFeatures: builder.query({
//       query: () => 'features',
//        method: "GET",
//       // Mock data for now
//       queryFn: () => ({ data: mockFeatures }),
//     }),
//     getFAQs: builder.query({
//       query: () => 'faqs',
//        method: "GET",
//       queryFn: () => ({ data: mockFAQs }),
//     }),
//     })
// })



// Mock data
export const mockFeatures = [
  {
    id: 1,
    title: 'Instant Transfers',
    description: 'Send money instantly to anyone, anywhere in the country',
    icon: 'zap',
  },
  {
    id: 2,
    title: 'Mobile Recharge',
    description: 'Top up your mobile balance with just a few taps',
    icon: 'smartphone',
  },
  {
    id: 3,
    title: 'Bill Payments',
    description: 'Pay your utility bills, rent, and other expenses',
    icon: 'receipt',
  },
  {
    id: 4,
    title: 'QR Code Payments',
    description: 'Scan and pay at merchants quickly and securely',
    icon: 'qr-code',
  },
  {
    id: 5,
    title: 'Savings Account',
    description: 'Earn interest on your digital wallet balance',
    icon: 'piggy-bank',
  },
  {
    id: 6,
    title: '24/7 Support',
    description: 'Get help whenever you need it with our support team',
    icon: 'headphones',
  },
]

export const mockFAQs = [
  {
    id: 1,
    question: 'How do I create a PayEase account?',
    answer: 'Download the PayEase app, verify your mobile number, and complete the KYC process with your national ID.',
  },
  {
    id: 2,
    question: 'What are the transaction limits?',
    answer: 'Daily limits vary by account type: Basic (৳25,000), Premium (৳100,000), Business (৳500,000).',
  },
  {
    id: 3,
    question: 'How secure is PayEase?',
    answer: 'We use bank-level encryption, biometric authentication, and real-time fraud monitoring to keep your money safe.',
  },
  {
    id: 4,
    question: 'Can I use PayEase internationally?',
    answer: 'Currently, PayEase works within Bangladesh. International services are coming soon.',
  },
  {
    id: 5,
    question: 'What fees do you charge?',
    answer: 'Send money: ৳5 fee, Cash out: 1.85% fee, Bill payments: Free, Mobile recharge: Free.',
  },
]



