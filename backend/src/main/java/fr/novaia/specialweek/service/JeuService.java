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

/**
 * Service layer for all game content types.
 */
@Service
@Transactional
public class JeuService {

    private final TypeQuestionQuizzRepository typeQuestionQuizzRepository;
    private final JeuQuizzRepository jeuQuizzRepository;
    private final JeuChasseAnomaliesRepository jeuChasseAnomaliesRepository;
    private final JeuSwiperRepository jeuSwiperRepository;
    private final QuestionMythoRepository questionMythoRepository;
    private final ReponseMythoRepository reponseMythoRepository;

    /**
     * Creates the service with required repositories.
     */
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

    /**
     * Lists all quiz question types.
     *
     * @return list of types
     */
    public List<TypeQuestionQuizz> findAllTypesQuizz() {
        return typeQuestionQuizzRepository.findAll();
    }

    /**
     * Lists all quiz games.
     *
     * @return list of quiz games
     */
    public List<JeuQuizz> findAllJeuxQuizz() {
        return jeuQuizzRepository.findAll();
    }

    /**
     * Finds a quiz by id.
     *
     * @param id quiz id
     * @return optional quiz
     */
    public Optional<JeuQuizz> findJeuQuizzById(Integer id) {
        return jeuQuizzRepository.findById(id);
    }

    /**
     * Saves a quiz.
     *
     * @param jeuQuizz quiz payload
     * @return saved quiz
     */
    public JeuQuizz saveJeuQuizz(JeuQuizz jeuQuizz) {
        return jeuQuizzRepository.save(jeuQuizz);
    }

    /**
     * Deletes a quiz by id.
     *
     * @param id quiz id
     */
    public void deleteJeuQuizz(Integer id) {
        jeuQuizzRepository.deleteById(id);
    }

    /**
     * Lists anomaly hunt games.
     *
     * @return list of anomaly games
     */
    public List<JeuChasseAnomalies> findAllJeuxAnomalies() {
        return jeuChasseAnomaliesRepository.findAll();
    }

    /**
     * Finds an anomaly hunt game by id.
     *
     * @param id game id
     * @return optional game
     */
    public Optional<JeuChasseAnomalies> findJeuAnomaliesById(Integer id) {
        return jeuChasseAnomaliesRepository.findById(id);
    }

    /**
     * Saves an anomaly hunt game.
     *
     * @param jeu payload
     * @return saved game
     */
    public JeuChasseAnomalies saveJeuAnomalies(JeuChasseAnomalies jeu) {
        return jeuChasseAnomaliesRepository.save(jeu);
    }

    /**
     * Deletes an anomaly hunt game by id.
     *
     * @param id game id
     */
    public void deleteJeuAnomalies(Integer id) {
        jeuChasseAnomaliesRepository.deleteById(id);
    }

    /**
     * Lists swiper games.
     *
     * @return list of swiper games
     */
    public List<JeuSwiper> findAllJeuxSwiper() {
        return jeuSwiperRepository.findAll();
    }

    /**
     * Finds a swiper game by id.
     *
     * @param id game id
     * @return optional game
     */
    public Optional<JeuSwiper> findJeuSwiperById(Integer id) {
        return jeuSwiperRepository.findById(id);
    }

    /**
     * Saves a swiper game.
     *
     * @param jeuSwiper payload
     * @return saved game
     */
    public JeuSwiper saveJeuSwiper(JeuSwiper jeuSwiper) {
        return jeuSwiperRepository.save(jeuSwiper);
    }

    /**
     * Deletes a swiper game by id.
     *
     * @param id game id
     */
    public void deleteJeuSwiper(Integer id) {
        jeuSwiperRepository.deleteById(id);
    }

    /**
     * Lists mytho questions.
     *
     * @return list of mytho questions
     */
    public List<QuestionMytho> findAllQuestionsMytho() {
        return questionMythoRepository.findAll();
    }

    /**
     * Finds a mytho question by id.
     *
     * @param id question id
     * @return optional question
     */
    public Optional<QuestionMytho> findQuestionMythoById(Integer id) {
        return questionMythoRepository.findById(id);
    }

    /**
     * Saves a mytho question.
     *
     * @param questionMytho payload
     * @return saved question
     */
    public QuestionMytho saveQuestionMytho(QuestionMytho questionMytho) {
        return questionMythoRepository.save(questionMytho);
    }

    /**
     * Deletes a mytho question by id.
     *
     * @param id question id
     */
    public void deleteQuestionMytho(Integer id) {
        questionMythoRepository.deleteById(id);
    }

    /**
     * Lists mytho answers.
     *
     * @return list of mytho answers
     */
    public List<ReponseMytho> findAllReponsesMytho() {
        return reponseMythoRepository.findAll();
    }

    /**
     * Finds a mytho answer by id.
     *
     * @param id answer id
     * @return optional answer
     */
    public Optional<ReponseMytho> findReponseMythoById(Integer id) {
        return reponseMythoRepository.findById(id);
    }

    /**
     * Saves a mytho answer.
     *
     * @param reponseMytho payload
     * @return saved answer
     */
    public ReponseMytho saveReponseMytho(ReponseMytho reponseMytho) {
        return reponseMythoRepository.save(reponseMytho);
    }

    /**
     * Deletes a mytho answer by id.
     *
     * @param id answer id
     */
    public void deleteReponseMytho(Integer id) {
        reponseMythoRepository.deleteById(id);
    }
}

