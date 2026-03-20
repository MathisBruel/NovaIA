package fr.novaia.specialweek.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * JPA entity for quiz games.
 */
@Entity
@Table(name = "jeu_quizz")
public class JeuQuizz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_question", nullable = false)
    private TypeQuestionQuizz typeQuestion;

    @Column(name = "media_url", length = 255)
    private String mediaUrl;

    @Column(name = "option_a", nullable = false, length = 255)
    private String optionA;

    @Column(name = "option_b", nullable = false, length = 255)
    private String optionB;

    @Column(name = "option_c", length = 255)
    private String optionC;

    @Column(name = "option_d", length = 255)
    private String optionD;

    @Column(name = "reponse_correcte", nullable = false)
    private Boolean reponseCorrecte;

    @Column(name = "question", nullable = false, length = 500)
    private String question;

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

    public TypeQuestionQuizz getTypeQuestion() {
        return typeQuestion;
    }

    public void setTypeQuestion(TypeQuestionQuizz typeQuestion) {
        this.typeQuestion = typeQuestion;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public Boolean getReponseCorrecte() {
        return reponseCorrecte;
    }

    public void setReponseCorrecte(Boolean reponseCorrecte) {
        this.reponseCorrecte = reponseCorrecte;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
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

