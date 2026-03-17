package fr.novaia.specialweek.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "question_mytho")
public class QuestionMytho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_reponses")
    private ReponseMytho reponses;

    @Column(name = "question", nullable = false, length = 255)
    private String question;

    @Column(name = "est_coherent")
    private Boolean estCoherent;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ReponseMytho getReponses() {
        return reponses;
    }

    public void setReponses(ReponseMytho reponses) {
        this.reponses = reponses;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Boolean getEstCoherent() {
        return estCoherent;
    }

    public void setEstCoherent(Boolean estCoherent) {
        this.estCoherent = estCoherent;
    }
}

