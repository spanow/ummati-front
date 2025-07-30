'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/common/StatCard';
import { 
  Heart, 
  Users, 
  Calendar, 
  Handshake,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Search,
  Star,
  Sparkles,
  TrendingUp,
  Plus
} from 'lucide-react';

interface Feature {
  icon: typeof Users;
  title: string;
  description: string;
}

interface Stat {
  icon: typeof Users;
  label: string;
  value: string;
}

interface Category {
  name: string;
  count: number;
  color: string;
}

interface Step {
  step: string;
  title: string;
  description: string;
  icon: typeof Users;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();

  const features: Feature[] = [
    {
      icon: Users,
      title: t('joinCommunity'),
      description: t('joinCommunityDesc'),
    },
    {
      icon: Calendar,
      title: t('findMissions'),
      description: t('findMissionsDesc'),
    },
    {
      icon: Handshake,
      title: t('createImpact'),
      description: t('createImpactDesc'),
    },
    {
      icon: Award,
      title: t('developSkills'),
      description: t('developSkillsDesc'),
    },
  ];

  const stats: Stat[] = [
    { icon: Users, label: t('activeVolunteers'), value: '12,500+' },
    { icon: Heart, label: t('partnerNGOs'), value: '450+' },
    { icon: Calendar, label: t('eventsOrganized'), value: '2,800+' },
    { icon: Clock, label: t('volunteerHours'), value: '85,000+' },
  ];

  const categories: Category[] = [
    { name: t('humanitarian'), count: 120, color: 'bg-emerald-100 text-emerald-800' },
    { name: t('environment'), count: 85, color: 'bg-green-100 text-green-800' },
    { name: t('education'), count: 95, color: 'bg-teal-100 text-teal-800' },
    { name: t('health'), count: 67, color: 'bg-cyan-100 text-cyan-800' },
    { name: t('social'), count: 78, color: 'bg-emerald-100 text-emerald-700' },
    { name: t('culture'), count: 45, color: 'bg-green-100 text-green-700' },
  ];

  const steps: Step[] = [
    {
      step: '1',
      title: 'Créez votre profil',
      description: 'Inscrivez-vous gratuitement et renseignez vos compétences et disponibilités.',
      icon: Users,
    },
    {
      step: '2',
      title: 'Trouvez des missions',
      description: 'Parcourez les opportunités qui correspondent à vos centres d\'intérêt.',
      icon: Search,
    },
    {
      step: '3',
      title: 'Participez et impactez',
      description: 'Rejoignez les événements et contribuez à des causes qui vous tiennent à cœur.',
      icon: CheckCircle,
    },
  ];

  // Contenu pour utilisateurs connectés
  if (isAuthenticated && user) {
    const isVolunteer = user.role === 'volunteer';
    const isOngAdmin = user.role === 'ong_admin';

    return (
      <div className="min-h-screen">
        {/* Hero Section pour utilisateurs connectés */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">
                <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Bienvenue, {user.firstName} !
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
                {isVolunteer 
                  ? 'Continuez votre aventure bénévole'
                  : 'Gérez vos missions et bénévoles'
                }
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                {isVolunteer 
                  ? 'Découvrez de nouvelles opportunités de bénévolat et continuez à créer un impact positif dans votre communauté.'
                  : 'Organisez des événements, gérez vos bénévoles et maximisez l\'impact de votre organisation.'
                }
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                {isVolunteer ? (
                  <>
                    <Link href="/events">
                      <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                        Découvrir des événements
                        <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Mon tableau de bord
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/admin/events/create">
                      <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        Créer un événement
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Mon tableau de bord
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions pour utilisateurs connectés */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Accédez rapidement à vos fonctionnalités principales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isVolunteer ? (
                <>
                  <Link href="/events">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Calendar className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Événements
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Découvrez de nouvelles missions
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/ongs">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          ONG
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Explorez les associations
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/profile">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Award className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Mon Profil
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Gérez vos informations
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/dashboard">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <TrendingUp className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Statistiques
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Suivez votre impact
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/admin/events/create">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Plus className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Créer un événement
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Organisez une nouvelle mission
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/admin/events">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Calendar className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Mes événements
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Gérez vos missions
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/admin/volunteers">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Bénévoles
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Gérez votre équipe
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/dashboard">
                    <Card className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                          <TrendingUp className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Tableau de bord
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Vue d'ensemble
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Notre impact ensemble
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez l'impact que nous créons ensemble dans la communauté.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={`stat-${index}`}
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  className="text-center hover:shadow-lg transition-shadow duration-200 border-emerald-100"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Contenu pour utilisateurs non connectés (version originale)
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">
              <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Plateforme #1 du bénévolat en Algérie
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
              Votre passion pour le bénévolat commence ici
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Découvrez des opportunités de bénévolat qui vous correspondent. Rejoignez des associations engagées et créez un impact positif dans votre communauté.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link href="/register">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  Devenir bénévole
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </Link>
              <Link href="/ongs">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Découvrir les ONG
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {stats.map((stat, index) => (
              <StatCard
                key={`stat-${index}`}
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
                className="text-center hover:shadow-lg transition-shadow duration-200 border-emerald-100"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Ummati ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous facilitons la rencontre entre bénévoles motivés et associations 
              qui ont besoin d'aide pour leurs missions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={`feature-${index}`} className="hover:shadow-lg transition-all duration-200 border-emerald-100 hover:border-emerald-200 group">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explorez nos domaines d'action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez des missions dans le domaine qui vous passionne le plus.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={`category-${index}`} href={`/ongs?category=${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-emerald-100 hover:border-emerald-200 group">
                  <CardContent className="p-4 text-center">
                    <Badge className={`${category.color} mb-2 group-hover:scale-105 transition-transform`}>
                      {category.count} ONG
                    </Badge>
                    <h3 className="font-medium text-gray-900">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/ongs">
              <Button variant="outline" size="lg" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Voir toutes les ONG
                <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En quelques étapes simples, commencez votre aventure bénévole.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={`step-${index}`} className="text-center">
                <div className="relative">
                  <div className="h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block absolute top-8 ${isRTL ? 'right-full' : 'left-full'} w-full h-0.5 bg-emerald-200 -translate-y-1/2 z-0`} />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="h-12 w-12 text-emerald-200 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Rejoignez notre communauté de bénévoles engagés et commencez dès aujourd'hui 
            à contribuer à des causes qui vous tiennent à cœur.
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-semibold bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg">
                Créer mon profil
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold bg-transparent border-white text-white hover:bg-white hover:text-emerald-700">
                Voir les événements
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}