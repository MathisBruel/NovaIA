package fr.novaia.specialweek.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * JPA entity for mytho answers.
 */
@Entity
@Table(name = "reponse_mytho")
public class ReponseMytho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "reponse_1", nullable = false, length = 255)
    private String reponse1;

    @Column(name = "reponse_2", nullable = false, length = 255)
    private String reponse2;

    @OneToOne
    @JoinColumn(name = "question_answer_1", nullable = false)
    @JsonIgnoreProperties({"reponses"})
    private QuestionMytho questionAnswer1;

    @OneToOne
    @JoinColumn(name = "question_answer_2", nullable = false)
    @JsonIgnoreProperties({"reponses"})
    private QuestionMytho questionAnswer2;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReponse1() {
        return reponse1;
    }

    public void setReponse1(String reponse1) {
        this.reponse1 = reponse1;
    }

    public String getReponse2() {
        return reponse2;
    }

    public void setReponse2(String reponse2) {
        this.reponse2 = reponse2;
    }

    public QuestionMytho getQuestionAnswer1() {
        return questionAnswer1;
    }

    public void setQuestionAnswer1(QuestionMytho questionAnswer1) {
        this.questionAnswer1 = questionAnswer1;
    }

    public QuestionMytho getQuestionAnswer2() {
        return questionAnswer2;
    }

    public void setQuestionAnswer2(QuestionMytho questionAnswer2) {
        this.questionAnswer2 = questionAnswer2;
    }
}

