import { motion } from 'framer-motion'
import { Card, } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  Award, 
  TrendingUp,
  Heart,
  Shield,
  Globe,
  Linkedin
} from 'lucide-react'

const About = () => {
  const milestones = [
    {
      year: '2020',
      title: 'Founded',
      description: 'PayEase was born with a vision to revolutionize digital payments in Bangladesh'
    },
    {
      year: '2021',
      title: '1M Users',
      description: 'Reached our first million users within 12 months of launch'
    },
    {
      year: '2022',
      title: 'Banking License',
      description: 'Obtained mobile financial services license from Bangladesh Bank'
    },
    {
      year: '2023',
      title: '5M Users',
      description: 'Expanded to 5 million active users across Bangladesh'
    },
    {
      year: '2024',
      title: '10M Users',
      description: 'Became Bangladesh\'s leading digital wallet with 10M+ users'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize the security of your financial data and transactions above everything else.'
    },
    {
      icon: Heart,
      title: 'Customer Centric',
      description: 'Our users are at the heart of everything we do. We build products that solve real problems.'
    },
    {
      icon: Globe,
      title: 'Financial Inclusion',
      description: 'Making financial services accessible to everyone, especially the unbanked population.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Continuously innovating to bring you the latest in fintech technology and services.'
    }
  ]

  const team = [
    {
      name: 'Aminul Islam',
      role: 'Chief Executive Officer',
      bio: 'Former VP at bKash with 15+ years in fintech. Leading PayEase\'s vision for financial inclusion.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      linkedin: '#'
    },
    {
      name: 'Fatima Rahman',
      role: 'Chief Technology Officer',
      bio: 'Ex-Google engineer with expertise in scalable systems. Building the tech backbone of PayEase.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300',
      linkedin: '#'
    },
    {
      name: 'Rafiq Ahmed',
      role: 'Chief Financial Officer',
      bio: 'Former CFO at Grameenphone with deep expertise in financial services and regulatory compliance.',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300',
      linkedin: '#'
    },
    {
      name: 'Sabrina Khan',
      role: 'Head of Product',
      bio: 'Product leader with experience at Pathao and Foodpanda. Crafting user experiences that delight.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      linkedin: '#'
    }
  ]

  const stats = [
    { number: '10M+', label: 'Active Users' },
    { number: '50,000+', label: 'Agent Points' },
    { number: '৳500B+', label: 'Transaction Volume' },
    { number: '64', label: 'Districts Covered' }
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
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                Empowering Bangladesh Through
                <span className="text-emerald-600 block">Digital Financial Services</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Founded in 2020, PayEase has grown to become Bangladesh's most trusted digital wallet, 
                serving over 10 million users with secure, convenient, and inclusive financial services.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600">
                Join Our Mission
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-8 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50 ">
                <div className="flex items-center mb-6">
                  <Target className="h-12 w-12 text-emerald-600 mr-4" />
                  <h2 className="text-3xl font-bold text-black">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To make financial services accessible, affordable, and convenient for every person in Bangladesh, 
                  regardless of their location, income level, or banking status. We believe that everyone deserves 
                  the right to secure and efficient financial services.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-center mb-6">
                  <Award className="h-12 w-12 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-bold text-black">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become the leading digital financial platform in South Asia, driving economic growth through 
                  financial inclusion and innovation. We envision a future where digital payments are as natural 
                  as breathing, enabling prosperity for all.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision we make and every product we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-5 h-full border-0 shadow-lg hover:shadow-xl transition-shadow gap-4">
                  <div className="bg-gradient-to-r from-emerald-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a startup dream to Bangladesh's leading digital wallet
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500"></div>
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-16 ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="p-6 border-0 shadow-lg gap-4">
                      <div className="text-2xl font-bold text-emerald-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                       <p className="text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact by Numbers</h2>
            <p className="text-xl text-emerald-100">
              The trust of millions drives us to do better every day
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experienced leaders from top companies driving innovation in Bangladesh's fintech space
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow gap-4">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <a href={member.linkedin} className="text-blue-600 hover:text-blue-700">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">{member.name}</h3>
                  <p className="text-emerald-600 font-medium">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-section">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Join Our <span className="text-emerald-600">Mission</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for financial inclusion and innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className='dark:text-gray-300 dark:bg-gray-800'>
                Partner With Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About