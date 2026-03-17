package fr.novaia.specialweek.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "Jeu_chasse_anomalies")
public class JeuChasseAnomalies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Lob
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "titre_image", nullable = false, length = 255)
    private String titreImage;

    @Column(name = "coordonnes_anomalie_json", nullable = false, columnDefinition = "json")
    private String coordonnesAnomalieJson;

    @Column(name = "explication", nullable = false, length = 255)
    private String explication;

    @Column(name = "points_accordes", nullable = false)
    private Integer pointsAccordes;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTitreImage() {
        return titreImage;
    }

    public void setTitreImage(String titreImage) {
        this.titreImage = titreImage;
    }

    public String getCoordonnesAnomalieJson() {
        return coordonnesAnomalieJson;
    }

    public void setCoordonnesAnomalieJson(String coordonnesAnomalieJson) {
        this.coordonnesAnomalieJson = coordonnesAnomalieJson;
    }

    public String getExplication() {
        return explication;
    }

    public void setExplication(String explication) {
        this.explication = explication;
    }

    public Integer getPointsAccordes() {
        return pointsAccordes;
    }

    public void setPointsAccordes(Integer pointsAccordes) {
        this.pointsAccordes = pointsAccordes;
    }
}

