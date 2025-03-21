# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
|Eltawil Sama Wael Abdelhai Abdelhadi |378051|
|Schifferli Théo Edouard |326468|
|Sipofo Kamegne Yann Eddy |327035|

# Spotify Billboard Hot 100 Analysis 📊🎶

## Milestone 1 (21st March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset
Our chosen datasets, **"[Billboard Hot 100 Weekly Charts with Spotify Audio Features](https://www.kaggle.com/datasets/thedevastator/billboard-hot-100-audio-features)"** and **"[Top Spotify Songs in 73 Countries Daily Updated](https://www.kaggle.com/datasets/asaniczka/top-spotify-songs-in-73-countries-daily-updated)"**, encompass weekly Billboard Hot 100 charts enriched with Spotify's audio features and daily rankings of the most popular songs across 73 countries, providing valuable insights into global music trends, song popularity, and the relationship between audio features and chart performance. 
The datasets are quite clean and requires minimal preprocessing. The only necessary step is handling NaN values, particularly for missing Spotify track previews. Once those are addressed, the dataset should be ready for visualization with little additional effort.

### Dataset 1: Billboard Hot 100 Audio Features

This dataset consists of two files: `Hot Stuff.csv` and `Hot 100 Audio Features.csv`.

#### File 1: `Hot Stuff.csv`

This file contains Billboard Hot 100 chart data for various songs.

**Columns of Interest (11 Total)**:
- `url`: URL of the Billboard chart for the given week.
- `WeekID`: The date of the Billboard chart (week level).
- `Week Position`: The position of the song on the chart for that week. (Numeric)
- `Song`: The title of the song. (Text)
- `Performer`: The name of the performing artist(s). (Text)
- `SongID`: A unique identifier for the song.
- `Instance`: Indicates breaks in the chart for a particular song. (Numeric)
- `Previous Week Position`: The song’s position on the chart in the previous week. (Numeric)
- `Peak Position`: The highest position the song has achieved on the chart. (Numeric)
- `Weeks on Chart`: The total number of weeks the song has been on the chart.


#### File 2: `Hot 100 Audio Features.csv`

This file contains audio features from Spotify for songs that appeared on the Billboard Hot 100.

**Columns of Interest (23 Total)**:
- `SongID`: A unique identifier for the song.
- `Performer`: The name of the performer or artist of the song. (Text)
- `Song`: The title of the song. (Text)
- `spotify_genre` : The genre(s) of the song according to Spotify's classification system. (Text)
- `spotify_track_id` : Spotify Track Id
- `spotify_track_preview_url` : The URL linking to a preview version of the song on Spotify, if available. (Text)
- `spotify_track_duration_ms`: The duration of the track in milliseconds.
- `spotify_track_explicit`: Boolean indicating whether the track contains explicit lyrics.
- `spotify_track_album`: The album in which the track appears. 
- `danceability`: A measure of how suitable a track is for dancing, based on tempo, rhythm stability, beat strength, and overall regularity.
- `energy`: A measure of intensity and activity; high-energy tracks feel fast, loud, and noisy.
- `key`: The key the track is in, using standard Pitch Class notation.
- `loudness`: The overall loudness of a track in decibels (dB).
- `mode`: Indicates the modality (major or minor) of a track.
- `speechiness`: Measures the presence of spoken words in a track.
- `acousticness`: A confidence measure of whether the track is acoustic.
- `instrumentalness`: Predicts whether a track contains no vocals.
- `liveness`: Detects the presence of an audience in the recording.
- `valence`: A measure describing the musical positiveness conveyed by a track.
- `tempo`: The overall estimated tempo of a track in beats per minute (BPM).
- `time_signature`: An estimated overall time signature of a track.
- `spotify_track_popularity`: Popularity score of the track on Spotify.


### Dataset 2: Top Spotify Songs in 73 Countries

This dataset provides daily rankings for the top songs across 73 countries and consists of one file `universal_top_spotify_songs.csv`

**Columns of interest (25 Total)**:
- `spotify_id`: The unique identifier for the song in the Spotify database. (type: str)
- `name`: The title of the song. (type: str)
- `artists`: The name(s) of the artist(s) associated with the song. Do split(', ') to convert to a list (type: str)
- `daily_rank`: The daily rank of the song in the top 50 list. (type: int)
- `country` : The ISO code of the country of the Top 50 Playlist. If Null, then the playlist if 'Global Top 50'. (type: str)
- `snapshot_date`: The date on which the data was collected from the Spotify API. (type: str)
- `popularity`: A measure of the song's current popularity on Spotify. (type: int)


### Problematic 
#### Motivation
Should you really be writing only POP MUSIC to make it to the Billboard Hot 100?

Music is more than just sound, it's a universal language that influences culture, evokes emotions, and shapes generations. From high-energy dance tracks that fuel parties to soulful ballads that stir deep emotions, music plays a powerful role in our daily lives. But what truly determines a song’s success?  

This project seeks to **uncover the hidden patterns behind chart-topping hits** by analyzing the impact of genre, and key musical features, such as energy, tempo, and danceability, on a song’s popularity. Instead of the conventional approach of tracking individual artists over time, we will introduce a **genre race**, visualizing how different musical styles have risen and fallen in popularity over the decades trying to uncover hidden gems in less known genres. This approach will allow us to **map the evolution of listener preferences**, identifying whether certain genres dominate during specific periods and whether emerging trends can help predict the next big hit.

Additionally, a **geographic visualization** will illustrate the **current daily distribution of top genres across different regions**, providing insights into how music tastes vary worldwide and how certain tracks gain global traction.

Finally, on a fun interactive note, we will develop a **machine learning model** that is trained to identify what particular features correspond to what genre permitting the realtime inference of the genre closest to a user’s taste based off his chosen musical features. This allows listeners to discover the tracks that align most with their preferences through sthe predicted genre.

Can we predict the future of music trends? Let’s dive in and find out.


#### Research Questions
- **Genre Influence on Chart Performance:** How do different genres correlate with chart positions? Do certain genres have a higher likelihood of reaching top spots?
- **Temporal Genre Trends:** How has the popularity of different genres evolved over the years? Are there dominant genres that define specific eras, or do new styles emerge and reshape the musical landscape?
- **Audio Features & Success Metrics:** What is the relationship between specific audio features (e.g., danceability, energy) and chart success? Are there recognizable patterns that contribute to higher rankings?
- **Spotting Emerging Artists:** How do new artists enter the charts, and what characteristics define tracks that propel them to prominence?

#### Target Audience
- **Music Industry Professionals:** Record labels, producers, and talent scouts seeking data-driven insights.
- **Music Enthusiasts:** Fans interested in the dynamics of music trends and chart movements.
- **Artists & Musicians:** Individuals aiming to understand the elements that contribute to chart success.


### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work

Several websites and research projects have analyzed trends in the **Billboard Hot 100** and song popularity. While **Billboard.com** provides weekly rankings, it lacks interactive exploration of historical data.

Our main inspiration comes from **The Pudding**, particularly:
- **[“A History of Music Genres”](https://pudding.cool/2017/03/music-history/)**, which visualizes how genres have evolved over time.
- **[“Love Songs Through the Decades”](https://pudding.cool/2024/11/love-songs/)**, analyzing lyrical trends in hit songs.

Other platforms like **Kaggle** and **FiveThirtyEight** have explored factors such as artist trends and the impact of streaming on rankings. However, these analyses are often static, lack interactivity, and do not incorporate **audio elements** or **geographic insights**.

##### Our Project
Our project expands on these ideas by offering a **more immersive experience**, allowing users to visualize:

- **And understand genre Distribution Over Time:** Race chronological charts illustrating the rise and decline of genre popularity over the years (Top 10).
- **Genre dominance** over decades, tracking the evolution of different styles.
- **Audio Feature Correlations:** Heatmaps revealing correlations between audio features and average chart rankings.
- **Artist and Genre Debut Analysis:** Line graphs tracking the debut and rise of new artists on the charts.
- **Top Features of Hit Songs:** Radar charts highlighting the distinctive audio feature profiles of top hits.
- **Genrify: Genre and Top Track Predictions:** A prediction of the genre and top track based on danceability, acousticness and other features, followed by an analysis of where they would be most listened to today.

## Milestone 2 (18th April, 5pm)

**10% of the final grade**


## Milestone 3 (30th May, 5pm)

**80% of the final grade**

## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
