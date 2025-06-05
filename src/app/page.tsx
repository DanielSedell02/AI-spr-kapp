import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Learn Languages with AI
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Experience personalized language learning through natural conversations, 
                  real-time feedback, and adaptive learning paths powered by advanced AI.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/signup"
                    className="btn-primary"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-primary-600/10 ring-1 ring-primary-50 md:-mr-20 lg:-mr-36" />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-primary-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-primary-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            Conversation
                          </div>
                          <div className="border-r border-gray-600/10 px-4 py-2">Feedback</div>
                        </div>
                      </div>
                      <div className="px-6 pt-6 pb-14">
                        {/* Example conversation */}
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-primary-500" />
                            </div>
                            <div className="min-w-0 flex-1 rounded-lg bg-gray-800 px-4 py-2">
                              <p className="text-sm text-gray-200">Hello! How are you today?</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-secondary-500" />
                            </div>
                            <div className="min-w-0 flex-1 rounded-lg bg-gray-700 px-4 py-2">
                              <p className="text-sm text-gray-200">I'm good, thank you! How about you?</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Learn Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to master a new language
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform provides personalized learning experiences that adapt to your needs,
            helping you learn faster and more effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    name: 'AI Conversations',
    description: 'Practice speaking with our AI language partner that adapts to your level and interests.',
  },
  {
    name: 'Real-time Feedback',
    description: 'Get instant feedback on your pronunciation, grammar, and vocabulary usage.',
  },
  {
    name: 'Personalized Learning',
    description: 'Follow a customized learning path that focuses on your goals and areas for improvement.',
  },
  {
    name: 'Interactive Stories',
    description: 'Learn through engaging stories and scenarios that make language learning fun and memorable.',
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your progress with detailed analytics and insights into your learning journey.',
  },
  {
    name: 'Cultural Context',
    description: 'Understand the cultural nuances and context behind the language you\'re learning.',
  },
] 