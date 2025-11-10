import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Users,
  Building,
  Headphones
} from 'lucide-react'

const Contact = () => {
  // const [submitContact, { isLoading }] = useSubmitContactMutation();
  //const [isLoading, setIsLoading] = useState(false)
  const isLoading = true;
  // const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const contactInfo = [
    {
      title: 'General Support',
      description: 'For general questions and account support',
      icon: Headphones,
      details: [
        { label: 'Email', value: 'support@payease.bd' },
        { label: 'Phone', value: '+880 1700-000000' },
        { label: 'Hours', value: '24/7 Available' }
      ],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Business Inquiries',
      description: 'Partnership and business opportunities',
      icon: Building,
      details: [
        { label: 'Email', value: 'business@payease.bd' },
        { label: 'Phone', value: '+880 1700-111111' },
        { label: 'Hours', value: '9 AM - 6 PM' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Media & Press',
      description: 'Press releases and media inquiries',
      icon: Users,
      details: [
        { label: 'Email', value: 'press@payease.bd' },
        { label: 'Phone', value: '+880 1700-222222' },
        { label: 'Hours', value: '9 AM - 5 PM' }
      ],
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const officeLocations = [
    {
      name: 'Head Office',
      address: 'Level 10, Bangladesh Bank Building, Motijheel, Dhaka 1000',
      phone: '+880 1700-000000',
      hours: '24/7 Support Center'
    },
    {
      name: 'Chittagong Office',
      address: 'City Center, Level 5, Agrabad, Chittagong 4100',
      phone: '+880 1700-333333',
      hours: '9 AM - 6 PM (Sun-Thu)'
    },
    {
      name: 'Sylhet Office',
      address: 'Amberkhana Point, Level 3, Sylhet 3100',
      phone: '+880 1700-444444',
      hours: '9 AM - 6 PM (Sun-Thu)'
    }
  ]

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Business Partnership',
    'Press Inquiry',
    'Feedback & Suggestions',
    'Bug Report',
    'Feature Request'
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-6 bg-emerald-100 text-emerald-700">
                📞 Contact Us
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch
                <span className="text-emerald-600 block">We're Here to Help</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Have questions, need support, or want to share feedback? Our dedicated team is ready to assist you. 
                Reach out through any channel that works best for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-emerald-600 mr-3" />
                  <span className="text-gray-700">24/7 Support Available</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Average response time: 2 minutes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <span className="text-gray-700">98% customer satisfaction rate</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Send us a Message</h2>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </CardHeader>
                <CardContent>
                  <form  className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+880 1XXX-XXXXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                          required
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide details about your inquiry..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
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
              Multiple Ways to <span className="text-emerald-600">Reach Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`bg-gradient-to-r ${contact.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <contact.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{contact.title}</h3>
                    <p className="text-gray-600">{contact.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contact.details.map((detail) => (
                        <div key={detail.label} className="flex justify-between">
                          <span className="text-gray-600">{detail.label}:</span>
                          <span className="font-medium">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6">
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
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
              Our <span className="text-emerald-600">Office Locations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit us in person at any of our offices across Bangladesh
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <motion.div
                key={office.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <MapPin className="h-6 w-6 text-emerald-600 mr-2" />
                      <h3 className="text-xl font-bold">{office.name}</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-700">{office.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-700">{office.hours}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6">
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find Us on the <span className="text-emerald-600">Map</span>
            </h2>
            <p className="text-xl text-gray-600">
              Our head office is located in the heart of Dhaka's financial district
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                  <p className="text-gray-600">
                    PayEase Head Office<br />
                    Level 10, Bangladesh Bank Building<br />
                    Motijheel, Dhaka 1000
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Emergency Support
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Account compromised or suspicious activity? Get immediate help from our security team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Phone className="mr-2 h-5 w-5" />
                Emergency Hotline: 999
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                <Mail className="mr-2 h-5 w-5" />
                security@payease.bd
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact