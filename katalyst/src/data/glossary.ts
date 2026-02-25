export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: "PM Core" | "AI/ML" | "Analytics" | "Strategy" | "Technical" | "Growth" | "Design";
  example: string;
  whyPMsCare: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "a-b-testing",
    term: "A/B Testing",
    definition:
      "A controlled experiment where two or more variants of a page, feature, or flow are shown to different user segments to determine which performs better on a target metric.",
    category: "Analytics",
    example:
      "Booking.com runs thousands of A/B tests simultaneously, testing everything from button color to copy changes on their search results page.",
    whyPMsCare:
      "A/B testing is the gold standard for data-driven decision making. PMs use it to validate hypotheses, reduce risk before full rollouts, and build a culture of experimentation.",
  },
  {
    id: "activation",
    term: "Activation",
    definition:
      "The moment a new user first experiences the core value of your product, often called the 'aha moment.' It is the critical step between acquisition and retention.",
    category: "Growth",
    example:
      "Facebook discovered that users who added 7 friends in 10 days were far more likely to become long-term users. That became their activation metric.",
    whyPMsCare:
      "Improving activation rate is one of the highest-leverage growth levers. PMs obsess over reducing friction between sign-up and the first moment of value.",
  },
  {
    id: "agile",
    term: "Agile",
    definition:
      "An iterative approach to software development and project management that emphasizes flexibility, collaboration, customer feedback, and rapid delivery of working software in short cycles called sprints.",
    category: "PM Core",
    example:
      "Spotify's squad model is a famous implementation of Agile principles, where small autonomous teams own features end-to-end and ship independently.",
    whyPMsCare:
      "Agile is the dominant delivery methodology in tech. PMs must understand sprint planning, backlog grooming, and how to write user stories that engineering teams can act on.",
  },
  {
    id: "api",
    term: "API (Application Programming Interface)",
    definition:
      "A set of protocols and tools that allows different software applications to communicate with each other. APIs define the methods and data formats for requests and responses.",
    category: "Technical",
    example:
      "Stripe's API lets any app integrate payment processing with just a few lines of code, enabling thousands of businesses to accept payments without building their own infrastructure.",
    whyPMsCare:
      "PMs working on platform products need to understand APIs as the building blocks of integrations. API design decisions directly affect developer experience and ecosystem growth.",
  },
  {
    id: "arpu",
    term: "ARPU (Average Revenue Per User)",
    definition:
      "A metric calculated by dividing total revenue by the number of active users in a given period. It measures how effectively a product monetizes its user base.",
    category: "Analytics",
    example:
      "Netflix's ARPU varies significantly by region: it is much higher in North America than in India, reflecting different pricing strategies and plan mixes.",
    whyPMsCare:
      "ARPU helps PMs understand monetization efficiency and evaluate the revenue impact of pricing changes, upsells, and new features.",
  },
  {
    id: "backlog",
    term: "Backlog",
    definition:
      "A prioritized list of features, bug fixes, technical debt, and improvements that a product team plans to work on. The backlog is continuously refined and reprioritized.",
    category: "PM Core",
    example:
      "At Amazon, product backlogs are driven by customer feedback working backwards from press releases. Items are ranked by customer impact and strategic alignment.",
    whyPMsCare:
      "The backlog is the PM's primary tool for communicating priorities to engineering. A well-maintained backlog reduces ambiguity and keeps the team focused on high-impact work.",
  },
  {
    id: "bias-in-ai",
    term: "Bias in AI",
    definition:
      "Systematic errors in AI model outputs that arise from biased training data, flawed labeling, or unrepresentative samples. Bias can lead to unfair or discriminatory outcomes for certain user groups.",
    category: "AI/ML",
    example:
      "Amazon scrapped an AI recruiting tool after discovering it was biased against women because it was trained on resumes submitted over 10 years, which were predominantly male.",
    whyPMsCare:
      "PMs shipping AI features must proactively audit for bias. Bias can damage brand trust, invite regulatory scrutiny, and harm vulnerable user groups.",
  },
  {
    id: "cac",
    term: "CAC (Customer Acquisition Cost)",
    definition:
      "The total cost of acquiring a new customer, calculated by dividing total sales and marketing spend by the number of new customers acquired in a period.",
    category: "Growth",
    example:
      "HubSpot reduced its CAC by investing heavily in inbound marketing and free tools, making content the primary acquisition engine instead of outbound sales.",
    whyPMsCare:
      "Understanding CAC relative to LTV is fundamental to sustainable growth. PMs use CAC to evaluate channel efficiency and justify investment in product-led growth features.",
  },
  {
    id: "churn-rate",
    term: "Churn Rate",
    definition:
      "The percentage of customers who stop using a product or cancel their subscription within a given time period. It is the inverse of retention.",
    category: "Analytics",
    example:
      "Netflix obsesses over churn and has found that users who do not find something to watch within 90 seconds are significantly more likely to churn.",
    whyPMsCare:
      "Reducing churn is often more impactful than acquiring new users. PMs analyze churn cohorts to identify at-risk segments and build retention features.",
  },
  {
    id: "cohort-analysis",
    term: "Cohort Analysis",
    definition:
      "A technique that groups users by a shared characteristic (usually sign-up date) and tracks their behavior over time. It reveals trends that aggregate metrics hide.",
    category: "Analytics",
    example:
      "Slack uses cohort analysis to track how teams adopted different features over their first 30 days, identifying which onboarding flows lead to higher retention.",
    whyPMsCare:
      "Cohort analysis is essential for understanding whether product changes actually improve outcomes or if you are just riding overall growth. It separates correlation from causation.",
  },
  {
    id: "computer-vision",
    term: "Computer Vision",
    definition:
      "A field of AI that enables machines to interpret and make decisions based on visual data such as images and videos. Techniques include object detection, image classification, and segmentation.",
    category: "AI/ML",
    example:
      "Google Lens uses computer vision to let users point their phone camera at objects and get instant information, from identifying plants to translating text.",
    whyPMsCare:
      "Computer vision opens up entirely new product categories. PMs need to understand its capabilities and limitations to scope features that use camera or image inputs.",
  },
  {
    id: "dau-mau",
    term: "DAU/MAU Ratio",
    definition:
      "The ratio of Daily Active Users to Monthly Active Users. It measures product stickiness by showing what fraction of monthly users return on any given day.",
    category: "Analytics",
    example:
      "Facebook has a DAU/MAU ratio above 65%, one of the highest in the industry, indicating extremely strong daily engagement and habit formation.",
    whyPMsCare:
      "DAU/MAU is a quick health check for engagement. A ratio above 50% suggests strong daily habit; below 20% suggests the product is used only occasionally.",
  },
  {
    id: "design-thinking",
    term: "Design Thinking",
    definition:
      "A human-centered problem-solving methodology with five phases: Empathize, Define, Ideate, Prototype, and Test. It focuses on deeply understanding user needs before jumping to solutions.",
    category: "Design",
    example:
      "Airbnb used design thinking to redesign their host onboarding flow, spending weeks living with hosts to empathize before building any new features.",
    whyPMsCare:
      "Design thinking prevents PMs from building solutions in search of problems. It ensures product decisions are grounded in real user needs rather than assumptions.",
  },
  {
    id: "discovery",
    term: "Discovery",
    definition:
      "The process of understanding user problems, validating assumptions, and evaluating potential solutions before committing engineering resources to build them.",
    category: "PM Core",
    example:
      "Marty Cagan advocates continuous discovery, where PMs conduct weekly user interviews and prototype tests to de-risk ideas before they enter the development backlog.",
    whyPMsCare:
      "Strong discovery habits prevent wasted engineering effort. PMs who skip discovery end up building features nobody wants and burning team credibility.",
  },
  {
    id: "embeddings",
    term: "Embeddings",
    definition:
      "Dense vector representations of data (text, images, users) in a continuous space where similar items are positioned closer together. They are fundamental to modern AI systems.",
    category: "AI/ML",
    example:
      "Spotify uses audio embeddings to power their recommendation engine, representing each song as a vector so similar-sounding tracks cluster together.",
    whyPMsCare:
      "Embeddings power search, recommendations, and personalization. PMs should understand them to scope AI features and communicate effectively with ML engineers.",
  },
  {
    id: "feature-flag",
    term: "Feature Flag",
    definition:
      "A software technique that allows teams to enable or disable features remotely without deploying new code. Feature flags enable gradual rollouts, A/B testing, and instant kill switches.",
    category: "Technical",
    example:
      "LaunchDarkly enables companies like IBM and Atlassian to release features to 1% of users first, monitor impact, and gradually roll out to 100%.",
    whyPMsCare:
      "Feature flags give PMs control over releases. They enable safe experimentation, targeted launches to specific segments, and quick rollback if something goes wrong.",
  },
  {
    id: "fine-tuning",
    term: "Fine-Tuning",
    definition:
      "The process of taking a pre-trained AI model and further training it on a smaller, domain-specific dataset to adapt it for a particular task or industry.",
    category: "AI/ML",
    example:
      "Bloomberg built BloombergGPT by fine-tuning a large language model on financial data, creating an AI that understands financial terminology and context far better than generic models.",
    whyPMsCare:
      "Fine-tuning determines whether an AI feature feels generic or magical. PMs must decide when to use off-the-shelf models vs. investing in fine-tuning for domain specificity.",
  },
  {
    id: "flywheel",
    term: "Flywheel",
    definition:
      "A self-reinforcing business model where each component of the system accelerates the others, creating compounding growth. Unlike funnels, flywheels emphasize momentum and feedback loops.",
    category: "Strategy",
    example:
      "Amazon's flywheel: lower prices attract more customers, which attracts more sellers, which increases selection, which improves customer experience, which drives more traffic.",
    whyPMsCare:
      "Understanding flywheels helps PMs identify where their features fit in the broader growth engine and which investments create compounding returns.",
  },
  {
    id: "gan",
    term: "GAN (Generative Adversarial Network)",
    definition:
      "A class of AI models consisting of two neural networks (a generator and discriminator) that compete against each other, enabling generation of realistic synthetic data like images, audio, or text.",
    category: "AI/ML",
    example:
      "NVIDIA used GANs to generate photorealistic faces of people who do not exist (thispersondoesnotexist.com), showcasing the technology's capability in synthetic media.",
    whyPMsCare:
      "GANs power features like image generation, style transfer, and data augmentation. PMs must also consider ethical implications of synthetic content in their products.",
  },
  {
    id: "go-to-market",
    term: "Go-to-Market (GTM) Strategy",
    definition:
      "A plan that specifies how a company will reach target customers and achieve competitive advantage when launching a new product or entering a new market.",
    category: "Strategy",
    example:
      "Slack's GTM strategy was bottom-up adoption: free teams would organically grow within enterprises until IT departments were forced to buy the paid plan.",
    whyPMsCare:
      "PMs own the product side of GTM. Understanding distribution strategy, pricing, and positioning ensures the product reaches the right users through the right channels.",
  },
  {
    id: "gradient-descent",
    term: "Gradient Descent",
    definition:
      "An optimization algorithm used to train machine learning models by iteratively adjusting model parameters in the direction that minimizes the loss function.",
    category: "AI/ML",
    example:
      "When training a neural network to recognize cats in images, gradient descent adjusts millions of weights to minimize the difference between predicted and actual labels.",
    whyPMsCare:
      "While PMs do not need to implement gradient descent, understanding it helps communicate with ML teams about training time, convergence issues, and model performance.",
  },
  {
    id: "hallucination",
    term: "Hallucination (AI)",
    definition:
      "When an AI model generates plausible-sounding but factually incorrect or fabricated information. Hallucinations are a key challenge for large language models and generative AI.",
    category: "AI/ML",
    example:
      "A lawyer submitted a brief containing fake case citations generated by ChatGPT, which confidently fabricated court cases that never existed.",
    whyPMsCare:
      "Hallucinations are a critical trust and safety issue. PMs must build guardrails, citation systems, and user education to manage this limitation in AI-powered features.",
  },
  {
    id: "hypothesis-driven",
    term: "Hypothesis-Driven Development",
    definition:
      "An approach where product decisions are framed as testable hypotheses with clear success criteria, rather than building features based on intuition or stakeholder requests.",
    category: "PM Core",
    example:
      "Instead of saying 'let us add social sharing,' a hypothesis-driven PM would say 'We believe adding social sharing to results will increase DAU by 5% within 2 weeks.'",
    whyPMsCare:
      "Framing work as hypotheses creates accountability, makes it easier to kill unsuccessful features, and builds a learning organization.",
  },
  {
    id: "iceberg-model",
    term: "Iceberg Model (ML Systems)",
    definition:
      "The observation that in production ML systems, the actual machine learning code is a small fraction of the total system. The bulk consists of data pipelines, serving infrastructure, monitoring, and testing.",
    category: "AI/ML",
    example:
      "Google's paper 'Hidden Technical Debt in ML Systems' revealed that ML code is often less than 5% of a production ML system; the rest is infrastructure.",
    whyPMsCare:
      "PMs who only scope the model underestimate effort by 10x. Understanding the iceberg helps PMs plan realistic timelines and budget for data pipelines, monitoring, and ops.",
  },
  {
    id: "jobs-to-be-done",
    term: "Jobs to Be Done (JTBD)",
    definition:
      "A theory that customers 'hire' products to accomplish specific jobs in their lives. It focuses on the underlying motivation rather than demographics or product features.",
    category: "PM Core",
    example:
      "Clayton Christensen's milkshake example: people 'hire' milkshakes for the 'job' of making a boring commute more interesting, not because of flavor preferences.",
    whyPMsCare:
      "JTBD helps PMs identify real competition (which may not be obvious competitors) and build features that address underlying motivations rather than surface-level requests.",
  },
  {
    id: "kpi",
    term: "KPI (Key Performance Indicator)",
    definition:
      "A measurable value that demonstrates how effectively a product or organization is achieving key objectives. KPIs should be specific, measurable, and tied to business outcomes.",
    category: "Analytics",
    example:
      "Uber's core KPIs include completed trips per active rider, driver utilization rate, and surge pricing frequency, all directly tied to their marketplace health.",
    whyPMsCare:
      "PMs are accountable for moving KPIs. Choosing the right KPIs ensures the team optimizes for outcomes that matter, not vanity metrics.",
  },
  {
    id: "latency",
    term: "Latency",
    definition:
      "The time delay between a user action and the system's response. In AI products, this includes model inference time plus network and processing overhead.",
    category: "Technical",
    example:
      "Google found that an extra 500ms of latency in search results decreased traffic by 20%. Amazon found that every 100ms of latency cost them 1% in sales.",
    whyPMsCare:
      "Latency directly impacts user experience and business metrics. PMs must set latency budgets and make tradeoffs between model sophistication and response time.",
  },
  {
    id: "llm",
    term: "LLM (Large Language Model)",
    definition:
      "A neural network trained on vast amounts of text data that can understand and generate human-like text. Examples include GPT-4, Claude, Gemini, and LLaMA.",
    category: "AI/ML",
    example:
      "ChatGPT demonstrated the commercial potential of LLMs by reaching 100 million users in just two months, the fastest-growing consumer application in history.",
    whyPMsCare:
      "LLMs are reshaping every software category. PMs must understand their capabilities, limitations, costs, and how to integrate them into products responsibly.",
  },
  {
    id: "ltv",
    term: "LTV (Lifetime Value)",
    definition:
      "The total revenue a business can expect from a single customer account throughout their entire relationship. LTV = Average Revenue Per User x Customer Lifetime.",
    category: "Growth",
    example:
      "Starbucks estimates the LTV of a customer at $14,099, justifying significant investment in their loyalty program and mobile app experience.",
    whyPMsCare:
      "LTV determines how much you can afford to spend on acquisition and retention. PMs use LTV to justify feature investments and optimize the customer lifecycle.",
  },
  {
    id: "marketplace",
    term: "Marketplace",
    definition:
      "A platform that connects buyers and sellers, creating value through matchmaking, trust, and transaction facilitation. Marketplaces face the classic chicken-and-egg problem.",
    category: "Strategy",
    example:
      "Airbnb solved the cold start problem by focusing on one city (New York) and personally photographing listings to bootstrap supply before scaling demand.",
    whyPMsCare:
      "Marketplace dynamics like liquidity, take rates, and network effects fundamentally shape product strategy. PMs must balance both sides of the market simultaneously.",
  },
  {
    id: "minimum-viable-product",
    term: "MVP (Minimum Viable Product)",
    definition:
      "The simplest version of a product that can be released to test a key business hypothesis with real users while minimizing development effort.",
    category: "PM Core",
    example:
      "Dropbox's MVP was a 3-minute video demonstrating the product concept. Sign-ups went from 5,000 to 75,000 overnight, validating demand without writing backend code.",
    whyPMsCare:
      "MVPs prevent over-engineering and accelerate learning. PMs must define the smallest scope that tests the riskiest assumption, not the smallest shippable feature set.",
  },
  {
    id: "moat",
    term: "Moat",
    definition:
      "A sustainable competitive advantage that protects a business from competitors. Common moats include network effects, switching costs, data advantages, brand, and economies of scale.",
    category: "Strategy",
    example:
      "Waze's data moat: more drivers contribute traffic data, which improves routing, which attracts more drivers, creating a virtuous cycle competitors cannot easily replicate.",
    whyPMsCare:
      "PMs should build features that deepen moats, not just add functionality. Understanding moat dynamics helps prioritize investments that create long-term competitive advantage.",
  },
  {
    id: "natural-language-processing",
    term: "NLP (Natural Language Processing)",
    definition:
      "A branch of AI focused on enabling machines to understand, interpret, and generate human language. NLP powers chatbots, search, translation, and sentiment analysis.",
    category: "AI/ML",
    example:
      "Google Translate uses NLP models that process entire sentences as context rather than translating word by word, dramatically improving translation quality.",
    whyPMsCare:
      "NLP enables conversational interfaces, automated support, and content understanding. PMs scoping NLP features must understand issues like language coverage, accuracy, and context limits.",
  },
  {
    id: "network-effects",
    term: "Network Effects",
    definition:
      "A phenomenon where a product becomes more valuable as more people use it. Direct network effects (same-side) and indirect network effects (cross-side) drive platform growth.",
    category: "Strategy",
    example:
      "LinkedIn becomes more valuable to each user as more professionals join, making it harder for competitors to displace even with a better product.",
    whyPMsCare:
      "Network effects are the strongest moat in tech. PMs at platform companies must identify and strengthen network effects in every feature decision.",
  },
  {
    id: "north-star-metric",
    term: "North Star Metric",
    definition:
      "A single metric that best captures the core value your product delivers to customers. It aligns the entire company around one measure of success.",
    category: "PM Core",
    example:
      "Airbnb's North Star Metric is nights booked, which captures both supply health and demand engagement in a single number.",
    whyPMsCare:
      "A clear North Star prevents teams from pulling in different directions. PMs use it to evaluate every initiative: does this move our North Star?",
  },
  {
    id: "okrs",
    term: "OKRs (Objectives and Key Results)",
    definition:
      "A goal-setting framework where Objectives define what you want to achieve (qualitative and inspiring) and Key Results define how you measure progress (quantitative and specific).",
    category: "PM Core",
    example:
      "Google popularized OKRs. An example: Objective: 'Delight users with a blazingly fast search experience.' Key Result: 'Reduce median search latency from 400ms to 200ms.'",
    whyPMsCare:
      "OKRs connect daily work to company strategy. PMs write OKRs for their product areas and use them to prioritize what to build each quarter.",
  },
  {
    id: "overfitting",
    term: "Overfitting",
    definition:
      "When a machine learning model performs extremely well on training data but poorly on new, unseen data. The model has memorized the training set rather than learning generalizable patterns.",
    category: "AI/ML",
    example:
      "A spam filter overfits when it learns to recognize specific spam emails in the training set but fails to catch new spam with different wording.",
    whyPMsCare:
      "Overfitting means your AI feature works great in testing but disappoints real users. PMs must ensure proper evaluation with held-out test sets and real-world monitoring.",
  },
  {
    id: "persona",
    term: "Persona",
    definition:
      "A semi-fictional representation of your ideal user based on research and data. Personas include demographics, behaviors, goals, pain points, and motivations.",
    category: "Design",
    example:
      "Spotify maintains detailed personas like 'Lean-Back Listener' (wants effortless music in the background) vs. 'Music Explorer' (actively seeking new artists and genres).",
    whyPMsCare:
      "Personas keep the team aligned on who they are building for. They prevent the dangerous assumption that all users think and behave like the product team.",
  },
  {
    id: "platform-thinking",
    term: "Platform Thinking",
    definition:
      "A strategic approach where products are designed as platforms that enable third-party developers or users to build on top of, creating an ecosystem of complementary value.",
    category: "Strategy",
    example:
      "Apple's App Store transformed the iPhone from a product into a platform, enabling millions of developers to create apps that make the iPhone more valuable.",
    whyPMsCare:
      "Platform thinking shifts the PM's role from building features to enabling an ecosystem. PMs must balance platform openness with quality control and user safety.",
  },
  {
    id: "product-market-fit",
    term: "Product-Market Fit",
    definition:
      "The state where a product satisfies strong market demand. Measured by retention, organic growth, and Sean Ellis's survey: 'How would you feel if you could no longer use this product?'",
    category: "PM Core",
    example:
      "Superhuman measures PMF with a survey, targeting 40%+ of users saying they'd be 'very disappointed' without the product as their threshold.",
    whyPMsCare:
      "PMF is the most important milestone for any product. Before PMF, PMs should focus exclusively on finding it. After PMF, the focus shifts to scaling it.",
  },
  {
    id: "prompt-engineering",
    term: "Prompt Engineering",
    definition:
      "The practice of designing and optimizing input prompts to get desired outputs from large language models. Techniques include few-shot examples, chain-of-thought reasoning, and system instructions.",
    category: "AI/ML",
    example:
      "Notion AI uses carefully crafted system prompts and few-shot examples to make GPT-4 generate content that matches Notion's specific formatting and tone conventions.",
    whyPMsCare:
      "Prompt engineering is the new UX design for AI products. Small changes in prompts dramatically affect output quality, making it a critical skill for AI PMs.",
  },
  {
    id: "prd",
    term: "PRD (Product Requirements Document)",
    definition:
      "A document that outlines the purpose, features, functionality, and behavior of a product or feature. Modern PRDs are living documents focused on outcomes rather than specifications.",
    category: "PM Core",
    example:
      "Amazon's PRD equivalent is the PRFAQ (Press Release and FAQ), which starts with the customer experience and works backward to technical requirements.",
    whyPMsCare:
      "The PRD is the PM's primary artifact. It aligns engineering, design, and stakeholders on what is being built, why, and how success will be measured.",
  },
  {
    id: "rag",
    term: "RAG (Retrieval-Augmented Generation)",
    definition:
      "A technique that enhances LLM outputs by first retrieving relevant documents from a knowledge base and including them as context in the prompt. It reduces hallucinations and keeps responses grounded.",
    category: "AI/ML",
    example:
      "Perplexity AI uses RAG to search the web in real-time and ground its AI-generated answers in actual sources, providing citations for every claim.",
    whyPMsCare:
      "RAG is the most practical way to make LLMs accurate for domain-specific use cases. PMs must decide what knowledge to index, how to chunk it, and how to present sources.",
  },
  {
    id: "retention",
    term: "Retention",
    definition:
      "The percentage of users who continue using a product over time. Typically measured as Day 1, Day 7, Day 30, and Day 90 retention rates for consumer products.",
    category: "Growth",
    example:
      "Instagram's Day 1 retention has historically been above 70%, meaning most new users come back the next day, driven by their strong content feed and notification strategy.",
    whyPMsCare:
      "Retention is the foundation of sustainable growth. No amount of acquisition can compensate for a leaky bucket. PMs prioritize retention as the single most important metric.",
  },
  {
    id: "roadmap",
    term: "Roadmap",
    definition:
      "A strategic document that communicates the planned direction and priorities of a product over time. Modern roadmaps focus on themes and outcomes rather than specific features and dates.",
    category: "PM Core",
    example:
      "Basecamp publishes outcome-based roadmaps organized by 'bets' rather than features, acknowledging uncertainty while communicating strategic direction.",
    whyPMsCare:
      "The roadmap is the PM's primary communication tool with stakeholders. It must balance commitment with flexibility and focus on problems to solve rather than features to build.",
  },
  {
    id: "saas",
    term: "SaaS (Software as a Service)",
    definition:
      "A software distribution model where applications are hosted in the cloud and accessed via subscription, rather than being installed locally. Revenue is recurring and predictable.",
    category: "Technical",
    example:
      "Salesforce pioneered the SaaS model, proving that enterprise software could be delivered via the web with monthly subscriptions instead of large upfront licenses.",
    whyPMsCare:
      "SaaS economics (MRR, churn, expansion revenue) fundamentally shape product priorities. PMs must understand subscription dynamics to build features that drive retention and expansion.",
  },
  {
    id: "sprint",
    term: "Sprint",
    definition:
      "A fixed time period (usually 1-2 weeks) during which a specific set of work is completed. Sprints include planning, daily standups, review, and retrospective ceremonies.",
    category: "PM Core",
    example:
      "Google Ventures' Design Sprint is a 5-day process for rapidly prototyping and testing ideas, compressing months of work into one week.",
    whyPMsCare:
      "Sprints give PMs a rhythm for shipping. Understanding sprint mechanics helps PMs scope work appropriately and set realistic expectations with stakeholders.",
  },
  {
    id: "stakeholder-management",
    term: "Stakeholder Management",
    definition:
      "The process of identifying, analyzing, and strategically engaging people who have influence over or are affected by your product decisions.",
    category: "PM Core",
    example:
      "A PM at a large bank must manage stakeholders across engineering, compliance, legal, marketing, and executive leadership, each with different priorities and concerns.",
    whyPMsCare:
      "Stakeholder management is often the hardest part of the PM job. PMs must build alignment across functions, manage competing priorities, and communicate decisions transparently.",
  },
  {
    id: "supervised-learning",
    term: "Supervised Learning",
    definition:
      "A machine learning approach where the model is trained on labeled data: input-output pairs where the correct answer is known. The model learns to predict outputs for new, unseen inputs.",
    category: "AI/ML",
    example:
      "Gmail's spam filter is trained via supervised learning on millions of emails labeled as spam or not-spam by users and manual reviewers.",
    whyPMsCare:
      "Supervised learning requires labeled training data, which is expensive. PMs must plan for data collection, labeling costs, and ongoing data quality when scoping ML features.",
  },
  {
    id: "technical-debt",
    term: "Technical Debt",
    definition:
      "The implied cost of future rework caused by choosing a quick or easy solution now instead of a better approach that would take longer. Like financial debt, it accumulates interest.",
    category: "Technical",
    example:
      "Twitter's early architecture was a monolith that could not handle the load during major events. Years of technical debt led to the famous 'fail whale' era.",
    whyPMsCare:
      "PMs must balance shipping speed with tech debt. Ignoring it leads to slower development, more bugs, and eventually a product that cannot evolve. Scheduling debt repayment is a PM responsibility.",
  },
  {
    id: "tokenization",
    term: "Tokenization",
    definition:
      "The process of breaking text into smaller units (tokens) that AI models can process. Tokens can be words, subwords, or characters depending on the tokenizer.",
    category: "AI/ML",
    example:
      "GPT-4's pricing is based on tokens processed. The word 'hamburger' might be split into 'ham', 'bur', 'ger' as three separate tokens.",
    whyPMsCare:
      "Token limits determine how much context an AI feature can process and directly impact costs. PMs must design features that work within token constraints and budget for token usage.",
  },
  {
    id: "transfer-learning",
    term: "Transfer Learning",
    definition:
      "A technique where a model trained on one task is repurposed for a different but related task. It dramatically reduces the data and compute needed to build AI features.",
    category: "AI/ML",
    example:
      "Medical imaging startups use transfer learning by taking models pre-trained on millions of general images and fine-tuning them on thousands of medical scans.",
    whyPMsCare:
      "Transfer learning makes AI features feasible for companies without massive datasets. PMs should explore pre-trained models before committing to training from scratch.",
  },
  {
    id: "unit-economics",
    term: "Unit Economics",
    definition:
      "The direct revenues and costs associated with a particular business model on a per-unit basis. For SaaS, a unit is typically a customer; for marketplaces, a transaction.",
    category: "Growth",
    example:
      "DoorDash's unit economics were negative for years: each delivery cost more to fulfill than the revenue it generated, subsidized by venture capital funding.",
    whyPMsCare:
      "PMs must ensure features improve unit economics, not just top-line metrics. Building features that increase LTV or reduce CAC creates sustainable growth.",
  },
  {
    id: "user-journey",
    term: "User Journey Map",
    definition:
      "A visual representation of the process a user goes through to accomplish a goal with your product. It maps touchpoints, emotions, pain points, and opportunities across the entire experience.",
    category: "Design",
    example:
      "IDEO created journey maps for the patient experience in hospitals, revealing that 80% of patient anxiety occurred before any medical procedure began.",
    whyPMsCare:
      "Journey maps reveal gaps between what you think the experience is and what users actually experience. They help PMs prioritize fixes at the most painful touchpoints.",
  },
  {
    id: "user-story",
    term: "User Story",
    definition:
      "A short, informal description of a feature from the user's perspective, following the format: 'As a [type of user], I want [goal] so that [benefit].'",
    category: "PM Core",
    example:
      "A user story for Uber: 'As a rider, I want to see my driver's estimated arrival time so that I know when to walk outside.'",
    whyPMsCare:
      "User stories are the bridge between PM strategy and engineering execution. Well-written stories provide enough context for engineers to build the right thing without over-specifying how.",
  },
  {
    id: "vanity-metric",
    term: "Vanity Metric",
    definition:
      "A metric that looks impressive but does not actually indicate meaningful business health or help make decisions. Common examples include total registered users or page views.",
    category: "Analytics",
    example:
      "MySpace had millions of registered users (vanity metric) but low engagement. Facebook tracked daily active users and time spent, revealing the real health of their product.",
    whyPMsCare:
      "PMs who report vanity metrics lose credibility with leadership. Focusing on actionable metrics that drive decisions is what separates great PMs from good ones.",
  },
  {
    id: "vector-database",
    term: "Vector Database",
    definition:
      "A specialized database designed to store and efficiently query high-dimensional vector embeddings. It enables similarity search, which powers recommendation systems and semantic search.",
    category: "AI/ML",
    example:
      "Pinecone and Weaviate power AI applications where you need to find 'similar' items, like matching a user query to the most relevant help article.",
    whyPMsCare:
      "Vector databases are the infrastructure behind modern AI search and recommendations. PMs scoping AI features should understand that semantic search requires vector storage.",
  },
  {
    id: "viral-coefficient",
    term: "Viral Coefficient (K-Factor)",
    definition:
      "A metric measuring how many new users each existing user generates. A K-factor above 1 means the product grows exponentially without additional marketing spend.",
    category: "Growth",
    example:
      "Hotmail achieved viral growth by adding 'Get your free email at Hotmail' to every outgoing email, turning each user into an acquisition channel.",
    whyPMsCare:
      "Viral features can dramatically reduce CAC. PMs should design sharing mechanics that feel natural rather than forced, where sharing is part of the core value proposition.",
  },
  {
    id: "wireframe",
    term: "Wireframe",
    definition:
      "A low-fidelity visual representation of a product's layout and functionality. Wireframes focus on structure and information architecture rather than visual design details.",
    category: "Design",
    example:
      "Before building their checkout flow, Stripe created wireframes to test different information architectures with users, discovering that a single-page checkout outperformed multi-step.",
    whyPMsCare:
      "Wireframes let PMs quickly communicate and test ideas before investing in high-fidelity design. They are a fast way to align stakeholders on scope and layout.",
  },
  {
    id: "zero-shot-learning",
    term: "Zero-Shot Learning",
    definition:
      "The ability of an AI model to perform a task it was not explicitly trained on, by leveraging its general knowledge and understanding of the task description.",
    category: "AI/ML",
    example:
      "GPT-4 can classify customer support tickets into categories it has never seen before, just by being given category descriptions in the prompt.",
    whyPMsCare:
      "Zero-shot capabilities mean PMs can build AI features without collecting training data for every use case. It dramatically reduces time-to-market for AI-powered features.",
  },
  {
    id: "accessibility",
    term: "Accessibility (a11y)",
    definition:
      "The practice of designing products that can be used by people with disabilities, including visual, auditory, motor, and cognitive impairments. Governed by standards like WCAG.",
    category: "Design",
    example:
      "Apple's VoiceOver and Switch Control features make iPhones usable by people with visual and motor impairments, setting the industry standard for accessibility.",
    whyPMsCare:
      "Accessibility is both an ethical obligation and a business opportunity. Over 1 billion people worldwide have disabilities. PMs who ignore a11y exclude a massive market segment.",
  },
  {
    id: "benchmark",
    term: "Benchmark",
    definition:
      "A standard or point of reference against which things may be compared. In AI, benchmarks are standardized tests that measure model performance on specific tasks.",
    category: "AI/ML",
    example:
      "The MMLU benchmark tests LLMs across 57 subjects from math to law, providing a standardized comparison of model capabilities across providers.",
    whyPMsCare:
      "PMs evaluating AI models need benchmarks to compare options objectively. But real-world performance often differs from benchmarks, so PMs must also run domain-specific evaluations.",
  },
  {
    id: "burn-rate",
    term: "Burn Rate",
    definition:
      "The rate at which a startup spends its cash reserves before generating positive cash flow. Gross burn is total spending; net burn subtracts revenue.",
    category: "Growth",
    example:
      "WeWork's burn rate exceeded $200M per month at its peak, ultimately leading to its failed IPO and near-collapse when investors lost confidence.",
    whyPMsCare:
      "PMs at startups must understand burn rate and runway. Feature decisions that extend runway (by improving monetization or reducing infrastructure costs) can be existential.",
  },
  {
    id: "canary-release",
    term: "Canary Release",
    definition:
      "A deployment strategy where a new version is rolled out to a small subset of users before being made available to the entire user base, allowing early detection of issues.",
    category: "Technical",
    example:
      "Google uses canary releases extensively, rolling out Search algorithm changes to 0.1% of traffic first and monitoring for quality regressions before full deployment.",
    whyPMsCare:
      "Canary releases reduce launch risk. PMs should understand deployment strategies to plan releases that protect user experience while enabling rapid iteration.",
  },
  {
    id: "conversion-rate",
    term: "Conversion Rate",
    definition:
      "The percentage of users who complete a desired action out of the total number who had the opportunity. It is a fundamental metric for measuring funnel effectiveness.",
    category: "Analytics",
    example:
      "Amazon's one-click purchase button was designed specifically to maximize conversion rate by eliminating every possible friction point in the checkout flow.",
    whyPMsCare:
      "Small conversion rate improvements can have massive business impact. PMs use conversion funnels to identify exactly where users drop off and prioritize optimization efforts.",
  },
  {
    id: "data-pipeline",
    term: "Data Pipeline",
    definition:
      "A series of automated processes that move data from source systems through transformation steps to a destination where it can be analyzed or used by applications and models.",
    category: "Technical",
    example:
      "Netflix's data pipeline processes billions of events daily from user interactions, feeding recommendation models, A/B test analysis, and business intelligence dashboards.",
    whyPMsCare:
      "AI and analytics features depend on reliable data pipelines. PMs must understand data flow to scope features accurately and debug issues when AI outputs seem wrong.",
  },
  {
    id: "double-diamond",
    term: "Double Diamond",
    definition:
      "A design process model with four phases: Discover (diverge to understand the problem), Define (converge on the problem statement), Develop (diverge to explore solutions), and Deliver (converge on the solution).",
    category: "Design",
    example:
      "The UK Design Council developed the Double Diamond model and used it to redesign the UK government's digital services, resulting in the award-winning GOV.UK website.",
    whyPMsCare:
      "The Double Diamond prevents PMs from jumping to solutions too quickly. It enforces proper problem understanding before solution development, leading to better outcomes.",
  },
  {
    id: "engagement-loop",
    term: "Engagement Loop",
    definition:
      "A cyclical pattern in product design where a trigger leads to an action, which delivers a reward, which motivates investment, which creates the next trigger. Based on Nir Eyal's Hook Model.",
    category: "Growth",
    example:
      "TikTok's engagement loop: notification trigger leads to opening the app, watching videos delivers variable rewards, and liking or following invests the user in the algorithm.",
    whyPMsCare:
      "Engagement loops are the mechanics behind habit-forming products. PMs must design ethical loops that deliver genuine value, not just addictive patterns.",
  },
  {
    id: "event-tracking",
    term: "Event Tracking",
    definition:
      "The practice of recording specific user actions and system events in a product to enable analytics, personalization, and debugging. Events capture what happened, when, and who did it.",
    category: "Analytics",
    example:
      "Amplitude and Mixpanel help PMs set up event tracking to understand user flows, measure feature adoption, and identify drop-off points in key funnels.",
    whyPMsCare:
      "Without proper event tracking, PMs are flying blind. Setting up the right events before launch ensures you can measure the impact of every feature you ship.",
  },
  {
    id: "freemium",
    term: "Freemium",
    definition:
      "A business model where a basic product is provided free of charge, while premium features, functionality, or virtual goods are available for a fee.",
    category: "Strategy",
    example:
      "Spotify's freemium model gives users ad-supported streaming for free, converting roughly 45% of active users to paid subscriptions over time.",
    whyPMsCare:
      "PMs at freemium companies must carefully balance the free experience (good enough to attract users) with premium value (compelling enough to convert). The paywall line is a critical product decision.",
  },
  {
    id: "guardrails",
    term: "Guardrails (AI Safety)",
    definition:
      "Constraints and safety mechanisms built into AI systems to prevent harmful, biased, or undesirable outputs. Guardrails include content filters, output validators, and human review systems.",
    category: "AI/ML",
    example:
      "OpenAI uses RLHF, constitutional AI principles, and content classifiers as guardrails to prevent ChatGPT from generating harmful or misleading content.",
    whyPMsCare:
      "AI guardrails are a PM responsibility, not just an engineering concern. PMs must define what 'safe' means for their context and ensure guardrails balance safety with usefulness.",
  },
  {
    id: "information-architecture",
    term: "Information Architecture (IA)",
    definition:
      "The structural design of shared information environments. IA focuses on organizing, structuring, and labeling content to help users find information and complete tasks.",
    category: "Design",
    example:
      "Notion's information architecture allows infinite nesting of pages and databases, giving users flexibility but requiring careful IA decisions about templates and defaults.",
    whyPMsCare:
      "Poor IA makes products confusing even when individual features are well-designed. PMs must ensure the overall structure helps users navigate and discover value efficiently.",
  },
  {
    id: "inference",
    term: "Inference (ML)",
    definition:
      "The process of using a trained machine learning model to make predictions on new data. Inference happens in real-time when users interact with AI features in production.",
    category: "AI/ML",
    example:
      "When you ask Alexa a question, inference happens in milliseconds as the speech recognition model, NLU model, and response generation model each process your request.",
    whyPMsCare:
      "Inference costs can dominate AI product economics. PMs must understand the cost per inference to build sustainable pricing and decide when to use large vs. small models.",
  },
  {
    id: "iteration",
    term: "Iteration",
    definition:
      "The process of repeatedly refining a product through cycles of building, measuring, and learning. Each iteration incorporates feedback from the previous cycle.",
    category: "PM Core",
    example:
      "Instagram started as Burbn, a location check-in app. Through rapid iteration and user feedback, the team pivoted to focus solely on photo sharing.",
    whyPMsCare:
      "Fast iteration velocity is a competitive advantage. PMs must create systems and processes that enable quick learning cycles without sacrificing quality.",
  },
  {
    id: "kanban",
    term: "Kanban",
    definition:
      "A visual workflow management method that uses cards on a board to represent work items moving through stages (To Do, In Progress, Done). It emphasizes continuous flow over fixed sprints.",
    category: "PM Core",
    example:
      "Toyota developed Kanban for manufacturing. Software teams at companies like Zapier use it for continuous deployment workflows where fixed sprints feel too rigid.",
    whyPMsCare:
      "Kanban is an alternative to Scrum that works well for teams with unpredictable workloads like support-heavy or operations teams. PMs should choose the right methodology for their team's context.",
  },
  {
    id: "model-drift",
    term: "Model Drift",
    definition:
      "The degradation of an ML model's performance over time as the statistical properties of the real-world data it operates on change from what it was trained on.",
    category: "AI/ML",
    example:
      "COVID-19 caused massive model drift in e-commerce recommendation systems as buying patterns shifted dramatically from pre-pandemic training data.",
    whyPMsCare:
      "Model drift means AI features quietly degrade without proper monitoring. PMs must plan for ongoing model maintenance, retraining schedules, and performance monitoring dashboards.",
  },
  {
    id: "mrr",
    term: "MRR (Monthly Recurring Revenue)",
    definition:
      "The predictable total revenue that a subscription business expects to receive every month. It is the key metric for SaaS company health and growth.",
    category: "Analytics",
    example:
      "Slack tracks MRR broken into New MRR, Expansion MRR (upgrades), Contraction MRR (downgrades), and Churn MRR to understand the full picture of revenue dynamics.",
    whyPMsCare:
      "MRR directly reflects PM impact. Features that reduce churn, drive upgrades, or enable new pricing tiers all show up in MRR, making it a key metric for PM performance reviews.",
  },
  {
    id: "multimodal-ai",
    term: "Multimodal AI",
    definition:
      "AI systems that can understand and generate content across multiple modalities: text, images, audio, video, and code. They process different types of input together rather than separately.",
    category: "AI/ML",
    example:
      "GPT-4V can analyze images and text together, enabling features like describing photos, reading charts, and answering questions about visual content.",
    whyPMsCare:
      "Multimodal AI enables entirely new interaction patterns. PMs can now design features where users communicate through photos, voice, and text simultaneously.",
  },
  {
    id: "net-promoter-score",
    term: "NPS (Net Promoter Score)",
    definition:
      "A metric measuring customer loyalty by asking 'How likely are you to recommend this product to a friend?' on a 0-10 scale. NPS = % Promoters (9-10) minus % Detractors (0-6).",
    category: "Analytics",
    example:
      "Apple consistently achieves NPS scores above 70, among the highest in tech, driven by product quality and customer service excellence.",
    whyPMsCare:
      "NPS is a lagging indicator of product quality and customer satisfaction. PMs use it to track overall sentiment and identify promoters who can become advocates.",
  },
  {
    id: "onboarding",
    term: "Onboarding",
    definition:
      "The process of guiding new users from sign-up to their first meaningful experience of value. Good onboarding reduces time-to-value and improves activation rates.",
    category: "Design",
    example:
      "Duolingo's onboarding lets users start a lesson before creating an account, demonstrating value immediately and deferring the friction of registration.",
    whyPMsCare:
      "Onboarding is where the most users are lost. PMs must obsess over reducing friction in the first experience and getting users to their 'aha moment' as fast as possible.",
  },
  {
    id: "opportunity-cost",
    term: "Opportunity Cost",
    definition:
      "The value of the next best alternative that is forgone when making a decision. In product management, it means every feature you build comes at the cost of features you cannot build.",
    category: "Strategy",
    example:
      "When Slack chose to build Slack Connect (cross-org messaging), the opportunity cost was delaying thread improvements that their power users desperately wanted.",
    whyPMsCare:
      "Understanding opportunity cost is fundamental to prioritization. PMs must constantly evaluate not just whether something is worth building, but whether it is the best use of limited resources.",
  },
  {
    id: "product-led-growth",
    term: "Product-Led Growth (PLG)",
    definition:
      "A go-to-market strategy where the product itself is the primary driver of customer acquisition, expansion, and retention, rather than relying on sales or marketing teams.",
    category: "Growth",
    example:
      "Figma's PLG motion: free plan for individuals, easy sharing creates viral exposure within organizations, teams self-serve to paid plans, then enterprise sales layer on top.",
    whyPMsCare:
      "PLG shifts responsibility for growth directly to the PM. The product must sell itself through excellent UX, clear value demonstration, and built-in sharing mechanics.",
  },
  {
    id: "product-ops",
    term: "Product Ops",
    definition:
      "A function that supports product management by handling tooling, processes, data analysis, and cross-functional coordination, allowing PMs to focus on strategy and execution.",
    category: "PM Core",
    example:
      "Uber's Product Ops team manages experiment infrastructure, standardizes PRD templates, and runs the quarterly planning process, freeing PMs to focus on product decisions.",
    whyPMsCare:
      "Product Ops amplifies PM effectiveness. As organizations scale, PMs who help establish Product Ops functions reduce their own operational burden and improve team consistency.",
  },
  {
    id: "reinforcement-learning",
    term: "Reinforcement Learning",
    definition:
      "A machine learning paradigm where an agent learns to make decisions by taking actions in an environment and receiving rewards or penalties based on outcomes.",
    category: "AI/ML",
    example:
      "DeepMind's AlphaGo used reinforcement learning to master the game of Go, eventually defeating the world champion by learning strategies no human had considered.",
    whyPMsCare:
      "Reinforcement learning powers dynamic optimization features like pricing, ad placement, and content ranking. PMs must define the reward functions that guide what the system optimizes for.",
  },
  {
    id: "retrospective",
    term: "Retrospective",
    definition:
      "A regular team meeting to reflect on what went well, what did not, and what can be improved. It is a core Agile ceremony focused on continuous process improvement.",
    category: "PM Core",
    example:
      "Atlassian runs retrospectives after every sprint using their own tools, categorizing feedback into 'Keep doing,' 'Stop doing,' and 'Start doing' columns.",
    whyPMsCare:
      "Retros are how PMs improve team velocity and morale over time. Leading effective retros that result in actionable changes is a key PM facilitation skill.",
  },
  {
    id: "scalability",
    term: "Scalability",
    definition:
      "The ability of a system to handle growth in users, data, or complexity without a proportional increase in cost or degradation in performance.",
    category: "Technical",
    example:
      "Twitter had to rewrite its entire backend from Ruby to Scala and Java to handle the massive scale of tweets during events like the Super Bowl.",
    whyPMsCare:
      "PMs must consider scalability when making architecture decisions early on. Features that work for 1,000 users may break at 1 million, requiring costly rewrites.",
  },
  {
    id: "segmentation",
    term: "Segmentation",
    definition:
      "The practice of dividing users into distinct groups based on shared characteristics like behavior, demographics, needs, or value. Enables targeted product and marketing strategies.",
    category: "Analytics",
    example:
      "Netflix segments users by viewing behavior to power personalization: what you see on the Netflix homepage is completely different from what another user sees.",
    whyPMsCare:
      "Segmentation reveals that 'average user' metrics hide important differences. PMs use segments to prioritize which users to build for and identify underserved groups.",
  },
  {
    id: "synthetic-data",
    term: "Synthetic Data",
    definition:
      "Artificially generated data that mimics the statistical properties of real data. Used to train AI models when real data is scarce, expensive, or privacy-sensitive.",
    category: "AI/ML",
    example:
      "Waymo generates synthetic driving scenarios to train autonomous vehicles, simulating rare edge cases like unusual weather conditions that are hard to capture in real driving data.",
    whyPMsCare:
      "Synthetic data can unblock AI features that are stalled due to data scarcity or privacy constraints. PMs should explore it as an option when collecting real data is impractical.",
  },
  {
    id: "time-to-value",
    term: "Time to Value (TTV)",
    definition:
      "The time it takes for a new user to reach their first moment of value after starting to use a product. Shorter TTV correlates with higher activation and retention.",
    category: "Growth",
    example:
      "Canva's TTV is under 60 seconds: a user can create a professional-looking design in their first session without any design skills or tutorial.",
    whyPMsCare:
      "Reducing TTV is one of the highest-impact product improvements. PMs should measure TTV and systematically eliminate every step between sign-up and first value.",
  },
  {
    id: "transformer",
    term: "Transformer (Architecture)",
    definition:
      "A neural network architecture based on self-attention mechanisms that processes all input tokens in parallel rather than sequentially. It is the foundation of modern LLMs like GPT and BERT.",
    category: "AI/ML",
    example:
      "Google's 2017 'Attention Is All You Need' paper introduced the Transformer architecture, which now powers virtually every major AI product from ChatGPT to Google Search.",
    whyPMsCare:
      "Transformers are why AI capabilities have exploded recently. PMs do not need to understand the math, but knowing the architecture helps communicate about model capabilities and limitations.",
  },
  {
    id: "usability-testing",
    term: "Usability Testing",
    definition:
      "A research method where representative users attempt to complete specific tasks with a product while observers note where they struggle. It reveals UX problems that analytics cannot.",
    category: "Design",
    example:
      "Steve Krug's 'Don't Make Me Think' advocates testing with just 5 users to uncover 85% of usability issues, making testing accessible to any team.",
    whyPMsCare:
      "Usability testing catches problems before they reach production. PMs who regularly test with users build better intuition and make fewer costly assumptions about user behavior.",
  },
  {
    id: "value-proposition",
    term: "Value Proposition",
    definition:
      "A clear statement that explains how your product solves a problem, delivers benefits, and why customers should choose you over alternatives. It is the core promise to your users.",
    category: "Strategy",
    example:
      "Zoom's value proposition was dead simple: 'Video conferencing that just works.' In a market full of complex enterprise tools, simplicity was the differentiator.",
    whyPMsCare:
      "A clear value proposition guides every product decision. PMs who cannot articulate their value proposition in one sentence will struggle to align their teams and attract users.",
  },
  {
    id: "working-backwards",
    term: "Working Backwards",
    definition:
      "Amazon's product development approach where teams start by writing a press release for the finished product and FAQ from the customer's perspective before writing any code.",
    category: "PM Core",
    example:
      "AWS Lambda was developed using the Working Backwards method. The internal press release described serverless computing from the developer's perspective before any code was written.",
    whyPMsCare:
      "Working Backwards forces PMs to think about customer value first and technology second. It prevents building impressive technology that nobody actually wants.",
  },
];
