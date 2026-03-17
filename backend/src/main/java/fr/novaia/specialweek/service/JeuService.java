package fr.novaia.specialweek.service;

import fr.novaia.specialweek.domain.JeuChasseAnomalies;
import fr.novaia.specialweek.domain.JeuQuizz;
import fr.novaia.specialweek.domain.JeuSwiper;
import fr.novaia.specialweek.domain.QuestionMytho;
import fr.novaia.specialweek.domain.ReponseMytho;
import fr.novaia.specialweek.domain.TypeQuestionQuizz;
import fr.novaia.specialweek.repository.JeuChasseAnomaliesRepository;
import fr.novaia.specialweek.repository.JeuQuizzRepository;
import fr.novaia.specialweek.repository.JeuSwiperRepository;
import fr.novaia.specialweek.repository.QuestionMythoRepository;
import fr.novaia.specialweek.repository.ReponseMythoRepository;
import fr.novaia.specialweek.repository.TypeQuestionQuizzRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class JeuService {

    private final TypeQuestionQuizzRepository typeQuestionQuizzRepository;
    private final JeuQuizzRepository jeuQuizzRepository;
    private final JeuChasseAnomaliesRepository jeuChasseAnomaliesRepository;
    private final JeuSwiperRepository jeuSwiperRepository;
    private final QuestionMythoRepository questionMythoRepository;
    private final ReponseMythoRepository reponseMythoRepository;

    public JeuService(
            TypeQuestionQuizzRepository typeQuestionQuizzRepository,
            JeuQuizzRepository jeuQuizzRepository,
            JeuChasseAnomaliesRepository jeuChasseAnomaliesRepository,
            JeuSwiperRepository jeuSwiperRepository,
            QuestionMythoRepository questionMythoRepository,
            ReponseMythoRepository reponseMythoRepository) {
        this.typeQuestionQuizzRepository = typeQuestionQuizzRepository;
        this.jeuQuizzRepository = jeuQuizzRepository;
        this.jeuChasseAnomaliesRepository = jeuChasseAnomaliesRepository;
        this.jeuSwiperRepository = jeuSwiperRepository;
        this.questionMythoRepository = questionMythoRepository;
        this.reponseMythoRepository = reponseMythoRepository;
    }

    public List<TypeQuestionQuizz> findAllTypesQuizz() {
        return typeQuestionQuizzRepository.findAll();
    }

    public List<JeuQuizz> findAllJeuxQuizz() {
        return jeuQuizzRepository.findAll();
    }

    public Optional<JeuQuizz> findJeuQuizzById(Integer id) {
        return jeuQuizzRepository.findById(id);
    }

    public JeuQuizz saveJeuQuizz(JeuQuizz jeuQuizz) {
        return jeuQuizzRepository.save(jeuQuizz);
    }

    public void deleteJeuQuizz(Integer id) {
        jeuQuizzRepository.deleteById(id);
    }

    public List<JeuChasseAnomalies> findAllJeuxAnomalies() {
        return jeuChasseAnomaliesRepository.findAll();
    }

    public Optional<JeuChasseAnomalies> findJeuAnomaliesById(Integer id) {
        return jeuChasseAnomaliesRepository.findById(id);
    }

    public JeuChasseAnomalies saveJeuAnomalies(JeuChasseAnomalies jeu) {
        return jeuChasseAnomaliesRepository.save(jeu);
    }

    public void deleteJeuAnomalies(Integer id) {
        jeuChasseAnomaliesRepository.deleteById(id);
    }

    public List<JeuSwiper> findAllJeuxSwiper() {
        return jeuSwiperRepository.findAll();
    }

    public Optional<JeuSwiper> findJeuSwiperById(Integer id) {
        return jeuSwiperRepository.findById(id);
    }

    public JeuSwiper saveJeuSwiper(JeuSwiper jeuSwiper) {
        return jeuSwiperRepository.save(jeuSwiper);
    }

    public void deleteJeuSwiper(Integer id) {
        jeuSwiperRepository.deleteById(id);
    }

    public List<QuestionMytho> findAllQuestionsMytho() {
        return questionMythoRepository.findAll();
    }

    public Optional<QuestionMytho> findQuestionMythoById(Integer id) {
        return questionMythoRepository.findById(id);
    }

    public QuestionMytho saveQuestionMytho(QuestionMytho questionMytho) {
        return questionMythoRepository.save(questionMytho);
    }

    public void deleteQuestionMytho(Integer id) {
        questionMythoRepository.deleteById(id);
    }

    public List<ReponseMytho> findAllReponsesMytho() {
        return reponseMythoRepository.findAll();
    }

    public Optional<ReponseMytho> findReponseMythoById(Integer id) {
        return reponseMythoRepository.findById(id);
    }

    public ReponseMytho saveReponseMytho(ReponseMytho reponseMytho) {
        return reponseMythoRepository.save(reponseMytho);
    }

    public void deleteReponseMytho(Integer id) {
        reponseMythoRepository.deleteById(id);
    }
}

