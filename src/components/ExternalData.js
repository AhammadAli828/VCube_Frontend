
const allTechnologies = [
    /// Programming Languages
    "Python", "Java", "JavaScript", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust",
    
    // Frameworks and Libraries
    // Web Frameworks
    "Django", "Flask", "FastAPI", "Ruby on Rails", "Laravel", "Spring", "Express.js", "ASP.NET",
    
    // JavaScript Frameworks/Libraries  
    "React", "Angular", "Vue.js", "Node.js", "jQuery", "D3.js", "Gatsby", "Next.js",
    
    // Data Science and Machine Learning
    "NumPy", "Pandas", "Matplotlib", "Scikit-learn", "TensorFlow", "Keras", "PyTorch", "Spark", "Hadoop",
    
    // Other Libraries
    "Flask-SQLAlchemy", "Django REST Framework", "Requests", "Beautiful Soup", "Scrapy", "Celery", "Redis",
    
    // Databases
    "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Oracle", "Microsoft SQL Server", "Redis", "Cassandra",
    
    // Cloud Platforms  
    "AWS", "Google Cloud", "Microsoft Azure", "Heroku", "DigitalOcean", "IBM Cloud",
    
    // Containerization and Orchestration
    "Docker", "Kubernetes", "Ansible", "Terraform", "Vagrant",
    
    // Version Control
    "Git", "GitHub", "GitLab", "Bitbucket",
    
    // Collaboration and Project Management
    "Jira", "Trello", "Asana", "Slack", "Discord",
    
    // Testing Frameworks
    "unittest", "pytest", "Selenium", "Cypress", "Jest", "Mocha",
    
    // Deployment and Monitoring
    "Nginx", "Apache", "Gunicorn", "Supervisor", "Sentry", "Datadog", "New Relic",
    
    // Integrated Development Environments (IDEs)
    "PyCharm", "Visual Studio Code", "Sublime Text", "Atom", "Vim", "Emacs",
    
    // HTML and CSS
    "HTML", "CSS",
    
    // CSS Frameworks
    "Bootstrap", "Foundation", "Bulma", "Tailwind CSS", "Materialize", "Semantic UI",
    
    // Miscellaneous
    "Jupyter Notebook", "Elasticsearch", "RabbitMQ", "Kafka", "Grafana", "Prometheus"
];


const Cities = [
    "All over India",
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Chennai",
    "Delhi NCR (includes Gurgaon and Noida)",
    "Pune",
    "Kolkata",
    "Coimbatore",
    "Kochi",
    "Nagpur",
    "Lucknow",
    "Jaipur",
    "Bhubaneswar",
    "Chandigarh",
    "Surat",
    "Visakhapatnam",
    "Agra",
    "Mysuru",
    "Patna",
    "Ghaziabad",
    "Faridabad",
    "Nashik",
    "Thiruvananthapuram",
    "Ahmedabad",
    "Indore",
    "Jamshedpur"
];

const error_types = [
    "Component Not Rendering",
    "TypeError",
    "ReferenceError",
    "SyntaxError",
    "Network Error",
    "API Error",
    "State Update Error",
    "Props Mismatch",
    "Unhandled Rejection",
    "Context Error",
    "Rendering Performance Issue",
    "Event Handler Error",
    "Dependency Error",
    "Hook Error",
    "Lifecycle Method Error",
    "Routing Error",
    "Async Error",
    "Component Key Error",
    "Invalid Prop Type",
    "Deprecated API Usage",
    "Runtime Error",
    "Compile Error",
    "Not a Function",
    "Invalid Component",
    "Memory Leak",
    "Unhandled Error",
    "Incorrect State Initialization",
    "Component Update Error",
    "Data Fetch Error",
    "DOM Manipulation Error",
    "Server-Side Rendering Error",
    "Error Boundaries Not Working",
    "Missing Dependency",
    "Invalid Context Value"
]

const strengths = [
    "Technical Skills",
    "Problem-Solving",
    "Communication",
    "Collaboration",
    "Adaptability",
    "Attention to Detail",
    "Time Management",
    "Analytical Thinking",
    "Creativity",
    "Project Management",
    "Software Development",
    "Version Control",
    "Agile Methodologies",
    "Testing and Debugging",
    "Data Analysis",
    "User Interface Design",
    "Customer Service Orientation",
    "Networking Knowledge",
    "Research Skills",
    "Self-Motivation",
    "Continuous Learning",
    "Technical Writing",
    "Programming Languages",
    "Cloud Computing",
    "Cybersecurity Awareness",
    "Database Management",
    "Troubleshooting",
    "Teamwork",
    "Critical Thinking",
    "Interpersonal Skills",
    "Flexibility",
    "Innovation",
    "Design Thinking",
    "Basic Networking",
    "Operating Systems Knowledge",
    "Framework Familiarity",
    "Mobile Development",
    "Web Development",
    "APIs Understanding",
    "Ethical Hacking Awareness"
]


const areas_of_improvement = [
    "Time Management",
    "Technical Depth",
    "Public Speaking",
    "Business Acumen",
    "Stress Management",
    "Networking Skills",
    "Self-Confidence",
    "Practical Experience",
    "Critical Analysis",
    "Presentation Skills",
    "Understanding of Business Processes",
    "Interpersonal Communication",
    "Effective Research",
    "New Technologies Adoption",
    "Soft Skills Development",
    "Analytical Skills",
    "Technical Documentation",
    "Professional Networking",
    "Feedback Reception",
    "Work-Life Balance",
    "Job Search Skills",
    "Interview Techniques",
    "Portfolio Development",
    "Industry Trends Awareness",
    "Negotiation Skills",
    "Leadership Skills",
    "Coding Practices",
    "Emotional Intelligence",
    "Cross-Functional Skills",
    "Collaboration Tools Proficiency",
    "Career Planning"
]


const mui_colors = ["#1976d2","#dc004e","#000","#ff9800","#2196f3","#f44336","#4caf50","#2196f3","#e33371","#ffb74d","#6ec6ff","#e57373","#81c784","#115293","grey","#9a0036","#f57c00","#0069c0","#d32f2f","#388e3c"];


export { allTechnologies, Cities, error_types, strengths, areas_of_improvement, mui_colors };