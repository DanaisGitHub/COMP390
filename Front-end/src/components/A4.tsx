import styles from '../styles/A4.module.css'
export default function A4(html: string) {
    return <div className={styles.a4Container} dangerouslySetInnerHTML={{ __html: html }}>

    </div>
}