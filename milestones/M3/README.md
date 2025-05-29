# 🎧 Genrify: Exploring Global Music Trends Through Data

Welcome to our Milestone 3 project for the Data Visualization course! This repository contains our interactive, narrative-driven D3.js-based exploration of music genre evolution across countries and platforms like Spotify and Billboard.

---

## 🌐 Project Overview

**"Genrify"** tells the story of how musical genres have shifted over time and across the globe, blending insights from streaming platforms (Spotify) and traditional charts (Billboard). Our visualizations aim to engage an audience of music enthusiasts, cultural researchers, and data lovers.

We leverage interactive maps, correlation analysis, time-based genre evolution, and Spotify previews to help users understand the dynamic evolution of music consumption and popularity worldwide.

---

## 📁 Repository Structure

```plaintext
.
├── _layouts/                # Jekyll layout templates (used for GitHub Pages)
├── assets/                  # Visual assets (images, icons, screencast)
├── data/                    # Cleaned & structured datasets (Spotify, Billboard, etc.)
├── data_preprocessing/      # Jupyter Notebooks and Python scripts for data wrangling
├── milestones/              # Milestone documents including the process book PDF
├── scripts/                 # Utility/debug scripts for preprocessing
├── correlation.html         # Correlation matrix of musical features
├── genre_race.html          # Animated genre race plot over time
├── genrify.html             # Spotify-based genre explorer with audio previews
├── map.html                 # Choropleth world map of genre dominance by country
├── scatter.html             # Scatterplot comparing multiple genre features
├── README.md                # Project README (you are here)
├── _config.yml              # Jekyll configuration for GitHub Pages
├── Gemfile / Gemfile.lock   # Jekyll dependencies
└── .gitignore               # Files to ignore in version control

```
---

## 📊 Key Visualizations

| Page             | Description                                                  |
|------------------|--------------------------------------------------------------|
| `genre_race.html` | Animated race plot of genre popularity over time             |
| `map.html`        | World map of dominant genres by country                      |
| `correlation.html`| Correlation matrix of features across genres                 |
| `scatter.html`    | Multi-feature scatterplot view of genres                     |
| `genrify.html`    | Spotify-based genre prediction                               |

---

## 📘 Process Book

📄 [Process Book](https://www.figma.com/deck/LpZxGX3HH5VB3I6Cts1b6M/COM-480-Process-Book?node-id=1-58&t=8E65Qo7Hk0PayK1V-1)

Our process book documents the entire journey of building **Genrify**, from idea to interactive implementation. It includes:

1. **Goals**  
   → What we aimed to achieve with this visualization project.

2. **Dataset**  
   → Description of the data sources used (Spotify, Billboard), including preprocessing steps.

3. **Exploratory Data Analysis**  
   → Initial findings, key distributions, feature correlations, and outliers.

4. **Storytelling**  
   → The narrative we constructed to guide the user through the data and insight discovery.

5. **Visualisations**  
   → Justification and explanation of each D3.js visualization developed.

6. **Challenges**  
   → Technical, design, and conceptual hurdles encountered during the project.

7. **Next Steps**  
   → How we would continue improving or extending this project.

---

## 🎥 Screencast

📹 [Watch the Demo Video (2 min)](assets/screencast.mp4)  
*A fun and insightful walkthrough of our interactive visualization.*
