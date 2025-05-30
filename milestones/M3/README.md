# 🎧 Genrify: Exploring Global Music Trends Through Data

Welcome to our Milestone 3 project for the Data Visualization course! This repository contains our interactive, narrative-driven D3.js-based [website](https://com-480-data-visualization.github.io/com-480-project-Certified-Lover-Data/) of music genre evolution across countries and platforms like Spotify and Billboard.

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
| `genrify.html`    | Spotify genre prediction                                     |

---

## 📘 Process Book

📄 [Process Book](https://www.figma.com/deck/LpZxGX3HH5VB3I6Cts1b6M/COM-480-Process-Book?node-id=1-58&t=8E65Qo7Hk0PayK1V-1)

The process book outlines our goals, describes the dataset, presents our exploratory data analysis, explains the storytelling approach, details the visualizations, discusses the challenges faced, and concludes with next steps for future improvements.

---

## 🎥 Screencast

📹 [Watch the Demo Video (2 min)](screencast.mp4)  

---

## ⚙️ Technical Setup

This project uses [Jekyll](https://jekyllrb.com/), a static site generator, to build and serve the website. Follow the steps below to run the website locally and explore the visualizations.

### 1. Clone the Repository

First, clone the repository to your local machine and navigate into the project folder:

```bash
git clone https://github.com/com-480-data-visualization/com-480-project-Certified-Lover-Data.git
cd com-480-project-Certified-Lover-Data
```

### 2. Install Ruby and Jekyll

Make sure you have [Ruby](https://www.ruby-lang.org/en/documentation/installation/) installed. Then install Bundler and Jekyll:

```bash
gem install bundler jekyll
```

### 3. Install Project Dependencies

Once inside the project folder, install the required Ruby gems (dependencies) using:

```bash
bundle install
```

### 4. Serve the Website Locally

Start the local development server with:

```bash
bundle exec jekyll serve
```

Jekyll will build the site and serve it at:

```
http://localhost:4000
```

Open this URL in your browser to view the website.

---

🎧 You're all set! Fire up the local server, explore the visualizations, and get ready to dive into the world of Drake and data. Enjoy the journey!