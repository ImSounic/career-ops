# Sounic Akkaraju — CV

**Location:** Enschede, Netherlands  
**Phone:** +31 611732672  
**Email:** imsounic.dev@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/imsounic/
**GitHub:** https://github.com/imsounic
**Portfolio:** https://imsounic.dev/

---

## Summary

MSc Computer Science (Data Science & Technology) student at University of Twente, with end-to-end experience across ML pipelines, NLP, distributed computing, and full-stack mobile development. Built production-grade systems from ensemble deep learning models (93.1% AUC-ROC) to distributed PySpark pipelines on 32GB datasets. Strong on both research rigour and engineering execution. Previous internship experience in backend AI development; seeking ML/AI engineering roles in the Netherlands or remote EU.

---

## Education

**MSc Computer Science — Data Science & Technologies**  
University of Twente, Netherlands | Sep 2025 – Jun 2027 (expected)  
Core modules: Machine Learning, Deep Learning, Natural Language Processing, Big Data

**BSc Computer Science and Artificial Intelligence**  
Aberystwyth University, United Kingdom | Sep 2023 – Jun 2025  
Core modules: Scientific Python (1st), Software Engineering (1st), Modelling Persistent Data (1st)

---

## Work Experience

**Software Engineering Intern**  
CoreTek Labs, India | Jul 2023 – Sep 2023

- Built an AI chatbot using Django REST framework, including backend infrastructure and web-scraping pipeline to train the knowledge base from the company website
- Collaborated closely with the backend team, contributing to knowledge-sharing and problem-solving across the development cycle

---

## Projects

### Miscarriage Prediction Using Ensemble Deep Learning Models
*Bachelor Thesis | Dec 2024 – May 2025*

- Developed novel **NearSMOTE** class-balancing technique combining SMOTE, NearMiss, and Tomek links to address severe class imbalance in healthcare prediction tasks
- Built ensemble deep learning system combining **TabTransformer, FT-Transformer, and TabNet** architectures, achieving **93.1% AUC-ROC** on NFHS-5 national health survey data
- Implemented end-to-end ML pipeline: LASSO feature selection → class balancing → model training (PyTorch on A100 GPU) → SHAP-based interpretability analysis
- Surfaced actionable clinical insights via SHAP: prenatal care and health checks as top protective factors against pregnancy complications

---

### Exploring In-Context Learning and LoRA vs BERT
*NLP Project | Sep 2025 – Nov 2025*

- 2-person research project comparing parameter-efficient fine-tuning approaches across classification, QA, and reasoning tasks using **10 benchmark datasets**
- Implemented BERT/DistilBERT fine-tuning pipeline achieving **93.7% accuracy on AG News**; analysed cross-task transfer limitations (near-random on out-of-domain tasks)
- Systematic ICL experiments on **Gemma3 models (270M–4B parameters)**, evaluating k-shot performance (k=0,5,10,25) across multiple decoding strategies
- Quantified key efficiency tradeoffs: BERT delivers **190x higher throughput** (3,837 vs 20 tokens/sec) but zero cross-task transfer; ICL context expansion increases latency 26–40%
- Co-authored research article with deployment recommendations for single-task vs multi-task production systems

---

### CleanSlate — Automated Chore Management Mobile App
*Personal Project | Jun 2025 – Present*

- Cross-platform mobile app (Flutter/Dart) with **Supabase backend**: PostgreSQL with Row-Level Security, real-time subscriptions, and Edge Functions
- Integrated **Google Calendar API with OAuth 2.0** for automatic chore syncing: token refresh and calendar event CRUD operations
- Designed 7-table relational schema supporting households, role-based permissions, recurring chores, and user-preference scheduling
- Architected using feature-first structure with Repository pattern across 15+ feature modules

---

### Crypto Market Microstructure Analysis
*Managing Big Data Project | Dec 2025 – Feb 2026*

- Built distributed data pipeline using **PySpark on HDFS** to process **32GB Binance trading history** across 1,000+ cryptocurrency pairs
- Engineered minute-level features: log returns, Amihud illiquidity, Parkinson volatility, taker ratios, and zero-volume flags from raw trade data
- Key findings: Large-cap volatility amplifies **19x during stress**; shocks propagate instantly (836/984 pairs at lag 0) while liquidity takes 2 hours to recover
- Implemented adaptive query execution, partition strategies, and Parquet columnar storage for scalable cluster deployment

---

## Technical Skills

| Category | Skills |
|---|---|
| **Languages** | Python, Dart, JavaScript/TypeScript, Java, SQL, HTML/CSS |
| **ML/AI** | PyTorch, TensorFlow, Scikit-learn, HuggingFace Transformers, SHAP, Pandas, NumPy, lm-eval |
| **Frameworks** | Flutter, Django REST, React, Next.js, PySpark, PostgreSQL, Supabase |
| **Cloud & Data** | Google Cloud (OAuth 2.0, Calendar API), Supabase (Auth, Storage, Realtime), HDFS, Parquet |
| **Concepts** | Deep Learning, NLP, Transformers, Distributed Computing, REST APIs, Database Design |

---

## Languages

English (Fluent) · Hindi (Fluent) · Telugu (Native) · Dutch (Learning)