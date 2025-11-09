import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FeatureCardSkeleton } from '@/components/ui/loading-skeleton'
import {
  Zap,
  Smartphone,
  Receipt,
  QrCode,
  PiggyBank,
  Headphones,
  Shield,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { loadingHandler } from '@/lib/utils'
import { mockFeatures } from '@/redux/features/features.faqs'

const Features = () => {
   
// 
const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const load = async () => {
        await loadingHandler(1500); 
        setLoading(false);
      };
      load();
    }, []);
    


  // 
  const iconMap = {
    'zap': Zap,
    'smartphone': Smartphone,
    'receipt': Receipt,
    'qr-code': QrCode,
    'piggy-bank': PiggyBank,
    'headphones': Headphones,
  }

  const additionalFeatures = [
    {
      title: 'Advanced Security',
      description: 'Multi-layer security with biometric authentication, PIN protection, and real-time fraud monitoring',
      features: ['Biometric Login', 'End-to-end encryption', 'Real-time alerts', 'Fraud detection'],
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Lightning Fast',
      description: 'Complete transactions in seconds with our optimized infrastructure and instant processing',
      features: ['Instant transfers', '< 3 second processing', '99.9% uptime', 'Real-time notifications'],
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      image: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Nationwide Coverage',
      description: 'Available in all 64 districts with 50,000+ agent points across Bangladesh',
      features: ['64 districts', '50K+ agents', 'Rural coverage', 'Urban presence'],
      icon: MapPin,
      color: 'from-green-500 to-teal-500',
      image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Multi-platform',
      description: 'Access your account from mobile app, web portal, USSD, or visit any agent point',
      features: ['Mobile app', 'Web portal', 'USSD (*123#)', 'Agent network'],
      icon: CreditCard,
      color: 'from-blue-500 to-purple-500',
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]

  const benefits = [
    { text: 'No monthly fees or hidden charges', icon: CheckCircle },
    { text: 'Free account setup and maintenance', icon: CheckCircle },
    { text: 'Competitive transaction rates', icon: CheckCircle },
    { text: '24/7 customer support', icon: CheckCircle },
    { text: 'Instant money transfers', icon: CheckCircle },
    { text: 'Secure biometric authentication', icon: CheckCircle }
  ]

  const stats = [
    { number: '< 3s', label: 'Transaction Time' },
    { number: '99.9%', label: 'Uptime' },
    { number: '256-bit', label: 'SSL Encryption' },
    { number: '24/7', label: 'Support Available' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <FeatureCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

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
              ⚡ Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 dark:text-muted">
              Everything You Need for
              <span className="text-emerald-600 block">Digital Payments</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From basic money transfers to advanced financial services, PayEase offers a complete suite of features 
              designed to make your financial life simpler, safer, and more convenient.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core <span className="text-emerald-600">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential services that millions of users rely on every day
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mockFeatures?.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Zap
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                    <CardHeader className="text-center pb-4">
                      <div className="bg-gradient-to-r from-emerald-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-xl">{feature.title}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced <span className="text-emerald-600">Capabilities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade features that set PayEase apart from the competition
            </p>
          </motion.div>

          <div className="space-y-16">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Card className="p-8 h-full border-0 shadow-xl">
                    <div className="flex items-center mb-6">
                      <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-full flex items-center justify-center mr-4`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <div className="flex mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {feature.features.map((item, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="relative">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="rounded-2xl shadow-2xl w-full"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20 rounded-2xl`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="text-emerald-600">PayFlow</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join millions who have already discovered the benefits of Bangladesh's most trusted digital wallet
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <benefit.icon className="h-6 w-6 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="text-lg text-gray-500">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-blue-50">
                <h3 className="text-2xl font-bold mb-6 text-center text-black">Performance Stats</h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience All <span className="text-emerald-600">Features</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create your free account today and unlock the full power of digital payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button className='!border-gray-600 dark:!border-white/30 dark:text-white/40' size="lg" variant="outline">
                Download App
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              ✨ No setup fees • Free forever • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Features