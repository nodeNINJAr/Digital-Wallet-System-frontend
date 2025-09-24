import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQSkeleton } from '@/components/ui/loading-skeleton'
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  Shield,
  CreditCard,
  Smartphone,
  Users,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import { useGetFAQsQuery } from '@/redux/features/features.faqs'

const Faqs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { data: faqs, isLoading } = useGetFAQsQuery({})

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'account', name: 'Account & Setup', icon: Users },
    { id: 'payments', name: 'Payments & Transfers', icon: CreditCard },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'mobile', name: 'Mobile App', icon: Smartphone },
  ]

  const contactOptions = [
    {
      title: '24/7 Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Phone Support',
      description: 'Call us at +880 1700-000000',
      icon: Phone,
      action: 'Call Now',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Email Support',
      description: 'Send us an email at support@payease.bd',
      icon: Mail,
      action: 'Send Email',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const popularTopics = [
    {
      title: 'How to create an account?',
      description: 'Step-by-step guide to getting started',
      link: '#create-account'
    },
    {
      title: 'Transaction limits and fees',
      description: 'Understand our pricing structure',
      link: '#transaction-fees'
    },
    {
      title: 'Security features',
      description: 'Learn about our safety measures',
      link: '#security'
    },
    {
      title: 'Mobile app features',
      description: 'Explore all app capabilities',
      link: '#mobile-app'
    }
  ]

  const filteredFAQs = faqs?.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-20">
          <FAQSkeleton />
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
              💬 Help Center
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How Can We
              <span className="text-emerald-600 block">Help You?</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find answers to your questions, learn about our features, or get in touch with our support team. 
              We're here to help you make the most of PayEase.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-0 shadow-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            {/* Popular Topics */}
            <div className="flex flex-wrap justify-center gap-3">
              {popularTopics.map((topic) => (
                <Button
                  key={topic.title}
                  variant="outline"
                  className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80"
                >
                  {topic.title}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
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
              Need Immediate <span className="text-emerald-600">Help</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className={`bg-gradient-to-r ${option.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  <Button className="w-full group-hover:bg-emerald-600 transition-colors">
                    {option.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
              Frequently Asked <span className="text-emerald-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find quick answers to the most common questions about PayEase
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full ${
                  selectedCategory === category.id 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            {filteredFAQs && filteredFAQs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-lg">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem
                        key={faq.id}
                        value={`item-${faq.id}`}
                        className="border-b last:border-b-0"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:text-emerald-600 transition-colors">
                          <span className="font-semibold">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any questions matching "{searchTerm}". Try a different search term or browse our categories.
                </p>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Clock className="h-12 w-12 mx-auto mb-4 text-emerald-200" />
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-emerald-100">Support Available</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-emerald-200" />
              <div className="text-3xl font-bold mb-2">&lt; 2min</div>
              <div className="text-emerald-100">Average Response</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Users className="h-12 w-12 mx-auto mb-4 text-emerald-200" />
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-emerald-100">Satisfaction Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-emerald-200" />
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-emerald-100">Articles & Guides</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Still Need <span className="text-emerald-600">Help</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our friendly support team is here to help you get the most out of PayEase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600">
                Contact Support
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Browse Help Center
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Average response time: less than 2 minutes
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Faqs