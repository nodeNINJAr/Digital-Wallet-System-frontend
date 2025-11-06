import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  CheckCircle, 
  X, 
  Star, 
  ArrowRight,
  Users,
  Building,
  Crown,
} from 'lucide-react'

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const transactionFees = [
    {
      service: 'Send Money',
      basic: '৳5 per transaction',
      premium: '৳3 per transaction',
      business: '৳2 per transaction',
      description: 'Transfer money to any PayEase user instantly'
    },
    {
      service: 'Cash Out',
      basic: '1.85%',
      premium: '1.5%',
      business: '1.2%',
      description: 'Withdraw cash from any agent point'
    },
    {
      service: 'Mobile Recharge',
      basic: 'Free',
      premium: 'Free',
      business: 'Free',
      description: 'Top up any mobile operator balance'
    },
    {
      service: 'Bill Payment',
      basic: 'Free',
      premium: 'Free',
      business: 'Free',
      description: 'Pay utility bills, internet, and more'
    },
    {
      service: 'QR Payment',
      basic: 'Free',
      premium: 'Free',
      business: 'Free',
      description: 'Pay at merchants using QR code'
    },
    {
      service: 'Bank Transfer',
      basic: '৳15',
      premium: '৳10',
      business: '৳8',
      description: 'Transfer to bank accounts'
    }
  ]

  const plans = [
    {
      name: 'Basic',
      icon: Users,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for personal use and getting started',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100',
      popular: false,
      limits: {
        dailyLimit: '৳25,000',
        monthlyLimit: '৳200,000',
        storage: '1 Year',
        support: 'Chat Support'
      },
      features: [
        'Send & receive money',
        'Mobile recharge',
        'Bill payments',
        'QR code payments',
        'Transaction history',
        'Basic security features',
        'Chat support'
      ],
      notIncluded: [
        'Priority customer support',
        'Advanced analytics',
        'Business features',
        'API access'
      ]
    },
    {
      name: 'Premium',
      icon: Crown,
      price: { monthly: 99, annual: 999 },
      description: 'Enhanced features for power users',
      color: 'from-emerald-500 to-blue-500',
      bgColor: 'from-emerald-50 to-blue-50',
      popular: true,
      limits: {
        dailyLimit: '৳100,000',
        monthlyLimit: '৳1,000,000',
        storage: '3 Years',
        support: 'Priority Support'
      },
      features: [
        'Everything in Basic',
        'Higher transaction limits',
        'Lower transaction fees',
        'Priority customer support',
        'Advanced security',
        'Spending analytics',
        'Multiple cards',
        'Investment features',
        'Insurance coverage'
      ],
      notIncluded: [
        'Business API access',
        'Bulk payments',
        'Custom integrations'
      ]
    },
    {
      name: 'Business',
      icon: Building,
      price: { monthly: 299, annual: 2999 },
      description: 'Complete solution for businesses',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      popular: false,
      limits: {
        dailyLimit: '৳500,000',
        monthlyLimit: '৳10,000,000',
        storage: 'Unlimited',
        support: 'Dedicated Manager'
      },
      features: [
        'Everything in Premium',
        'Business dashboard',
        'Bulk payment processing',
        'API access',
        'Custom integrations',
        'Advanced reporting',
        'Multi-user management',
        'Dedicated account manager',
        'White-label options'
      ],
      notIncluded: []
    }
  ]

  const additionalServices = [
    {
      title: 'PayEase Card',
      description: 'Physical debit card linked to your wallet',
      price: '৳500 one-time fee',
      features: ['ATM withdrawals', 'POS payments', 'Online shopping', 'International usage']
    },
    {
      title: 'Insurance Coverage',
      description: 'Protect your account and transactions',
      price: '৳50/month',
      features: ['Fraud protection', 'Unauthorized transaction coverage', '24/7 claim support', 'Up to ৳500,000 coverage']
    },
    {
      title: 'Investment Services',
      description: 'Grow your money with mutual funds and bonds',
      price: '0.5% management fee',
      features: ['Mutual fund investments', 'Government bonds', 'Portfolio management', 'Expert advice']
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-6 bg-emerald-100 text-emerald-700">
              💰 Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent
              <span className="text-emerald-600 block">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, no surprises. 
              Upgrade or downgrade anytime with just a few taps.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg ${!isAnnual ? 'text-emerald-600 font-semibold' : 'text-gray-600'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-emerald-600"
              />
              <span className={`text-lg ${isAnnual ? 'text-emerald-600 font-semibold' : 'text-gray-600'}`}>
                Annual
              </span>
              <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                Save 17%
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full border-0 shadow-xl ${plan.popular ? 'ring-2 ring-emerald-500' : ''}`}>
                  <CardHeader className={`text-center pb-8 rounded-t-lg bg-gradient-to-br ${plan.bgColor}`}>
                    <div className={`bg-gradient-to-r ${plan.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="text-center">
                      <span className="text-4xl font-bold">
                        ৳{isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-gray-600">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    </div>
                    {plan.price.monthly > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        {isAnnual ? `৳${Math.round(plan.price.annual / 12)}/month billed annually` : 'Billed monthly'}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Limits */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Account Limits</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Daily Limit:</span>
                          <span className="font-medium">{plan.limits.dailyLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Limit:</span>
                          <span className="font-medium">{plan.limits.monthlyLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data Storage:</span>
                          <span className="font-medium">{plan.limits.storage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Support:</span>
                          <span className="font-medium">{plan.limits.support}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-center opacity-50">
                          <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price.monthly === 0 ? 'Get Started Free' : 'Choose Plan'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction Fees */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transaction <span className="text-emerald-600">Fees</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Clear, competitive pricing for all your financial transactions
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-6 font-semibold">Service</th>
                      <th className="text-center p-6 font-semibold">Basic</th>
                      <th className="text-center p-6 font-semibold">Premium</th>
                      <th className="text-center p-6 font-semibold">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionFees.map((fee, index) => (
                      <motion.tr
                        key={fee.service}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-6">
                          <div>
                            <div className="font-semibold">{fee.service}</div>
                            <div className="text-sm text-gray-600">{fee.description}</div>
                          </div>
                        </td>
                        <td className="p-6 text-center font-medium">{fee.basic}</td>
                        <td className="p-6 text-center font-medium text-emerald-600">{fee.premium}</td>
                        <td className="p-6 text-center font-medium text-purple-600">{fee.business}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Additional <span className="text-emerald-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Optional premium services to enhance your PayEase experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                    <div className="text-2xl font-bold text-emerald-600">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pricing <span className="text-emerald-600">FAQ</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll prorate any billing differences."
              },
              {
                q: "Are there any hidden fees?",
                a: "No hidden fees! All our pricing is transparent. The only costs are the plan subscription and transaction fees clearly listed above."
              },
              {
                q: "What happens if I exceed my transaction limits?",
                a: "You can upgrade your plan instantly to get higher limits, or wait for the next billing cycle when your limits reset."
              },
              {
                q: "Is there a free trial for Premium and Business plans?",
                a: "Yes! We offer a 30-day free trial for Premium and Business plans. You can cancel anytime during the trial with no charges."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee on all paid plans. Contact our support team if you're not satisfied."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get <span className="text-emerald-600">Started</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join millions of satisfied users and start your digital payment journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              ✨ 30-day free trial • No setup fee • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Pricing