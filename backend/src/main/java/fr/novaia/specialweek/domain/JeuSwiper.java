package fr.novaia.specialweek.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "Jeu_swiper")
public class JeuSwiper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Lob
    @Column(name = "image_post_url", nullable = false)
    private String imagePostUrl;

    @Column(name = "est_fiable", nullable = false)
    private Boolean estFiable;

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

    public String getImagePostUrl() {
        return imagePostUrl;
    }

    public void setImagePostUrl(String imagePostUrl) {
        this.imagePostUrl = imagePostUrl;
    }

    public Boolean getEstFiable() {
        return estFiable;
    }

    public void setEstFiable(Boolean estFiable) {
        this.estFiable = estFiable;
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

