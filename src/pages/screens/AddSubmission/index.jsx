import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

//Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

//Material UI
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//Local
import Layout from 'components/Layout'
import styles from './Submission.module.scss'
import { Progression }  from 'components/Progression'

//Material UI
import { firebase } from "db/client"
import { MaterialStyles } from 'lib/MaterialStyles'


let explainer = {
    default: {
        title: "Submitting Hacks",
        desc: "DIYHacks will never steal your idea ( because you don't have to tell us what it is )!"
    },
    industry: {
        title: "Industry",
        desc: "This helps us match hackers with hacks that they'll be interested in!"
    },
    contribution: {
        title: "Contribution",
        desc: "Will you be contributing techncally? If so, put your role! If not, you may leave this blank."
    },
    title: {
        title: "Title",
        desc: "If you want, you can set a name for your hack. If not, you may leave this blank. We'll generate one for you."
    },
    eng: {
        title: "Engineers",
        desc: "Please select the min and max number of engineers you'd like to sign up to your hack! (Keep in mind that you'll have to talk to those that sign up!)"
    },
    design: {
        title: "Designers",
        desc: "Please select the min and max number of designers you'd like to sign up to your hack! (Keep in mind that you'll have to talk to those that sign up!)"
    },
    pm: {
        title: "Product Managers",
        desc: "Please select the min and max number of Pproduct managers you'd like to sign up to your hack! (Keep in mind that you'll have to talk to those that sign up!)"
    }
}

let AddSubmission = () => {
    const router = useRouter()

    let [industry, setIndustry] = useState('')
    let [contribution, setContribution] = useState('')
    let [hackTitle, setHackTitle] = useState('')
    let [engRange, setEngRange] = useState([1, 3])
    let [designRange, setDesignRange] = useState([1, 3])
    let [pmRange, setPmRange] = useState([1, 3])

    let [focus, setFocus] = useState('default')
    let [title, setTitle] = useState('')
    let [desc, setDesc] = useState('')

    let [apiProgress, setApiProgress] = useState('idle')

    const [open, setOpen] = useState(false)

    const formControlClasses = MaterialStyles().classesFormControl
    const inputsClasses = MaterialStyles().classesInput
    const classes = MaterialStyles().classesFormControl

    useEffect(() => {
        localStorage.setItem('lastVisited', 'AddSubmission')
    }, [])

    useEffect(() => {
        setTitle(explainer[focus].title)
        setDesc(explainer[focus].desc)
    }, [focus])

    const handleSubmit = async () => {
        setApiProgress('pending')
        let { displayName, uid } = firebase.auth().currentUser
        let data = JSON.stringify({
            industry,
            contribution,
            hackTitle,
            engRange,
            designRange,
            pmRange,
            submitter_name: displayName,
            submitter: uid
        })

        await fetch('/api/submit', {
            method: 'POST',
            body: data
        })
        setApiProgress('success')
    }

    const getProgress = state =>  {
        return { display: apiProgress === state ? 'block' : 'none' }
    }

    return (
        <Layout title="Submission | DIYHacks" nav={true}>
            <Container className={styles.body}>
                <Row className="mt-5 pt-5">
                    <Col className="text-center">
                        <h1>SUBMIT A HACK</h1>
                    </Col>
                </Row>
                <Row className="flex-grow-1">
                    <Col className="py-5 my-5">
                        <Row>
                            <Col>
                                <Row className="justify-content-center">
                                    <FormControl required variant="outlined"
                                                 classes={formControlClasses}
                                                 onMouseDown={() => setFocus('industry')}>
                                        <TextField
                                            variant="outlined"
                                            value={industry}
                                            onChange={e => { setIndustry(e.target.value) }}
                                            label="Industry"
                                            color="primary"
                                            classes={inputsClasses}
                                            select
                                            required
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </TextField>
                                    </FormControl>
                                    <FormControl required variant="outlined"
                                                 classes={formControlClasses}
                                                 onMouseDown={() => setFocus('contribution')}>
                                        <TextField
                                            variant="outlined"
                                            value={contribution}
                                            onChange={e => { setContribution(e.target.value) }}
                                            label="Contribution"
                                            color="primary"
                                            select
                                            required>
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </TextField>
                                    </FormControl>
                                    <FormControl variant="outlined" classes={formControlClasses} onMouseDown={() => setFocus('title')}>
                                        <TextField
                                            variant="outlined"
                                            value={hackTitle}
                                            onChange={e => { setHackTitle(e.target.value) }}
                                            color="primary"
                                            label="Title" />
                                        <FormHelperText>Optional</FormHelperText>
                                    </FormControl>
                                </Row>
                                <Row className="justify-content-center">
                                    <FormControl classes={formControlClasses} onMouseDown={() => setFocus('eng')}>
                                        <label id="eng-range" className="slider-label">Engineering</label>
                                        <Slider
                                            max={5}
                                            defaultValue={[1, 3]}
                                            value={engRange}
                                            valueLabelDisplay="auto"
                                            aria-labelledby="eng-range"
                                            onChange={(event, newVal) => setEngRange(newVal)}
                                            color="primary"
                                        />
                                    </FormControl>
                                    <FormControl classes={formControlClasses} onMouseDown={() => setFocus('design')}>
                                        <label id="design-range" className="slider-label">Design</label>
                                        <Slider
                                            max={5}
                                            defaultValue={[1, 3]}
                                            value={designRange}
                                            valueLabelDisplay="auto"
                                            aria-labelledby="design-range"
                                            onChange={(event, newVal) => setDesignRange(newVal)}
                                            color='secondary'
                                        />
                                    </FormControl>
                                    <FormControl classes={formControlClasses} onMouseDown={() => setFocus('pm')}>
                                        <label id="pm-range" className="slider-label">Product Managers</label>
                                        <Slider
                                            max={5}
                                            defaultValue={[1, 3]}
                                            value={pmRange}
                                            valueLabelDisplay="auto"
                                            aria-labelledby="pm-range"
                                            onChange={(event, newVal) => setPmRange(newVal)}
                                            color="tertiary"
                                        />
                                    </FormControl>
                                </Row>
                                <Row className="justify-content-center">
                                    <button className="btn btn-secondary" onClick={() => setOpen(true)}>SUBMIT</button>
                                </Row>
                            </Col>
                            <Col>
                                <Row className={styles.desc_wrapper}>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <h2>{title}</h2>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p>{desc}</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Dialog
                    maxWidth={'xs'}
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="confirm"
                    PaperProps={{ className: MaterialStyles().classesPopup.paper }}
                >
                    <div style={getProgress('idle')}>
                        <DialogTitle id="confirm" className="text-center">Confirm</DialogTitle>
                        <DialogContent>
                            <DialogContentText className={MaterialStyles().classesDialogText.root}>Yes? You're ready to submit?</DialogContentText>
                        </DialogContent>
                        <DialogActions className="justify-content-center">
                            <button className="btn btn-primary" onClick={handleSubmit}>SUBMIT</button>
                        </DialogActions>
                    </div>

                    <div style={getProgress('pending')} >
                        <Progression />
                    </div>


                    <div style={getProgress('success')}>
                        <DialogTitle id="confirm" className="text-center">Submissions Updated</DialogTitle>
                        <DialogActions className="justify-content-center">
                            <button className="btn btn-primary"
                                    onClick={() => {router.push('/[screen]', '/Dashboard')}}>
                                BACK TO DASHBOARD
                            </button>
                        </DialogActions>
                    </div>
                </Dialog>
            </Container>
        </Layout>
    )
}

export default AddSubmission