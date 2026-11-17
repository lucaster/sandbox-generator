# Generazione del piano di un singolo livello

## Scopo

Procedura che genera **il piano di un solo livello** del dungeon: un grafo connesso di
stanze e corridoi appartenenti a quel livello. Non genera aree, link tra livelli,
fazioni né mostri vaganti: tutto questo è già prodotto dalla generazione esistente e
viene passato come input.

Si parte da un **corridoio di ingresso del livello con almeno uno sbocco che dia su una
stanza**; a ogni sbocco si collega una stanza o un altro corridoio; le porte della stanza
diventano a loro volta nuovi sbocchi, e il processo continua fino a raggiungere il numero
di stanze previsto per quel livello. Un ingresso con sole scale o finali che proseguono
senza stanza non basta: verrebbe generato un piano senza stanze.

Quando si raggiunge `numeroStanze`, gli sbocchi avanzati dei **corridoi foglia** non
vengono buttati via: vengono collegati a **stanze già esistenti** dello stesso livello.
Il risultato non è più un albero puro, ma un grafo con collegamenti trasversali e
possibili cicli; `roomCount` resta invariato.

Le singole stanze e i singoli corridoi **non vengono reinventati**: sono generati dalle
procedure già implementate in `sandbox-generator-ng/src/data/dungeon.ts`:

| Procedura esistente | Ruolo in questa procedura |
| --- | --- |
| `resolveRoomCount(opzioni, tiro)` | numero di stanze da raggiungere (già calcolato per il livello) |
| `generateRoom(numero, profondita, mostriVaganti, opzioni, tiro)` | genera una stanza (tipo, tesoro, dimensioni, forma, porte) |
| `calcDungeonCorridor(opzioniCorridoio)` | genera un corridoio (sezioni, feature, finale) |
| `generateDoor(tiro, latoCorridoio?)` | genera le porte, anche quelle laterali dei corridoi |
| `randomOptionEntry(tabella, tiro)` | estrae da `tableDungeonCorridorDoorSide` ecc. |

`generateLevel` è il **chiamante** della procedura (vedi §3), non fa parte di essa.

## Input / Output

```
INPUT:
    numeroStanze    ← roomCount del livello
    profondita      ← depth del livello
    mostriVaganti   ← wanderingMonsters del livello
    opzioni         ← DungeonOptions (forme, % tana, rollFn)
    oc              ← { hasDeeperLevel, hasHigherLevel, rollFn }
                       opzioni per calcDungeonCorridor, passate dal chiamante

OUTPUT:
    stanze                 lista di DungeonRoom generate e collegate
    corridoi               lista di DungeonCorridor generati e collegati
    collegamenti           archi intra-livello (chi è collegato a chi);
                           gli archi aggiuntivi verso stanze esistenti hanno loop = vero
    corridoioIngresso      id del corridoio da cui parte il livello
```

## Assunti espliciti

1. **Lo "sbocco" non è ancora un tipo dati nel codice.** Viene derivato dall'output delle
   procedure esistenti: dalle `features` delle sezioni e dall'`end` di `DungeonCorridor`,
   e dall'array `doors` di `DungeonRoom`. Non si modifica il formato di quelle tabelle.
2. **Il grafo è topologico, non metrico.** Non si assegnano coordinate quadrato per
   quadrato: si registra solo *chi è collegato a chi* e *tramite quale porta/sbocco*.
   La disposizione su griglia resta un passo successivo.
3. **Ambito: un solo livello.** La procedura non legge né modifica la cross-section
   (`dungeon.link`, aree, altri livelli). L'ingresso del livello è segnato con l'etichetta
   `Ingresso`: per il livello più alto coincide con l'ingresso dalla superficie, per gli
   altri con le scale dal livello superiore, ma la procedura non crea link verticali.
4. I flag `hasDeeperLevel` / `hasHigherLevel` arrivano dal chiamante (calcolati
   dall'area confrontando il `depth` dei livelli che la compongono): servono solo a far
   sì che `calcDungeonCorridor` scarti i finali "scale" non disponibili.
5. **Nessun doppio tiro.** Con l'opzione `assembleFloorPlan: true`, `generateLevel` non
   genera la lista piatta di stanze e lascia `rooms: []`: le stanze sono generate una
   sola volta, da `generateRoom`, dentro questa procedura. La sequenza di `rollFn` resta
   deterministica e non vengono consumati tiri inutili. Con `false` il comportamento
   attuale resta invariato.

## Definizione di "sbocco"

### Sbocchi di un corridoio (da `calcDungeonCorridor`)

| Output della procedura esistente | Tipo di sbocco | Elemento da collegare |
| --- | --- | --- |
| `features` contiene `Door on left/…: … (opens to a room)` | `PORTA_STANZA` (con lato) | stanza |
| `features` contiene `Secret door: …` | `PORTA_SEGRETA` | stanza segreta |
| `end = 'Dead end (or reroll)'` | — | nessuno (vicolo cieco) |
| `end = 'Door/Portcullis'` | `PORTA_STANZA` | stanza |
| `end = 'X intersection'` | `INCROCIO_X` | corridoio di prosecuzione |
| `end = 'T intersection'` | `INCROCIO_T` | corridoio di prosecuzione |
| `end = 'Left turn'` | `SVOLTA_SINISTRA` | corridoio di prosecuzione |
| `end = 'Right turn'` | `SVOLTA_DESTRA` | corridoio di prosecuzione |
| `end = 'Stairs to a deeper/higher level'` | `SCALE` | uscita verticale, nessuna stanza |

### Sbocchi di una stanza (da `generateRoom`)

| Porta in `stanza.doors` | Tipo di sbocco | Elemento da collegare |
| --- | --- | --- |
| `type = 'Secret door'` | `PORTA_SEGRETA` | stanza segreta |
| `destination = 'Corridor'` | `SBOCCO_CORRIDORIO` | corridoio |
| `destination = 'Room'` | `PORTA_STANZA` | stanza |

Una stanza con `doorCount = 0` non genera sbocchi: diventa un vicolo cieco.

## Pseudocodice

### 1. Entry point: `generaPianoLivello`

```
FUNZIONE generaPianoLivello(numeroStanze, profondita, mostriVaganti, opzioni, oc, tiro):

    // A volte le porte esauriscono gli sbocchi prima di raggiungere numeroStanze:
    // si ricostruisce il piano con lo stesso rollFn, senza generare stanze in anticipo.
    tentativiPiano ← 0
    RIPETI
        piano ← costruisciPianoLivello(numeroStanze, profondita, mostriVaganti, opzioni, oc, tiro)
        tentativiPiano ← tentativiPiano + 1
    FINCHÉ numero(piano.stanze) = numeroStanze OPPURE tentativiPiano ≥ MAX_RIPROVAZIONI_PIANO  // es. 20

    RESTITUISCI piano


FUNZIONE costruisciPianoLivello(numeroStanze, profondita, mostriVaganti, opzioni, oc, tiro):

    stanze        ← lista vuota
    corridoi      ← lista vuota
    collegamenti  ← lista vuota
    coda          ← coda vuota              // sbocchi da sviluppare
    sbocchiAvanzati ← lista vuota           // sbocchi di corridoi foglia non sviluppati
    prossimoNumeroStanza ← 1
    prossimoNumeroCorridoio ← 1

    // ---- Passo 1: corridoio di ingresso, con almeno uno sbocco per una stanza --
    tentativi ← 0
    RIPETI
        ingresso ← calcDungeonCorridor(oc)
        sbocchi  ← sbocchiCorridoio(ingresso)
        tentativi ← tentativi + 1
    FINCHÉ esisteSboccoStanza(sbocchi) OPPURE tentativi ≥ MAX_TENTATIVI_INGRESSO  // es. 20

    SE non esisteSboccoStanza(sbocchi) ALLORA
        // Fallback deterministico: si forza una porta nella prima sezione,
        // sempre tramite le procedure/tabelle già implementate.
        ingresso.sections[1].features ← [ generaPortaLateraleCorridoio(tiro) ]
        sbocchi ← sbocchiCorridoio(ingresso)

    aggiungiCorridoio(ingresso, sorgente ← 'Ingresso')
    accoda(coda, sbocchi, sorgente ← ingresso)

    // ---- Passo 2: espansione + recupero dei dead end -------------------------
    tentativi ← 0
    FINCHÉ numero(stanze) < numeroStanze E tentativi < MAX_TENTATIVI_FALLBACK:

        espandi(coda)                        // consuma tutti gli sbocchi raggiungibili

        SE numero(stanze) ≥ numeroStanze: ESCI

        // La coda si è svuotata prima di raggiungere il numero di stanze:
        // si riapre un vicolo cieco (o una porta non ancora usata) e si
        // genera un nuovo corridoio da lì, mantenendo la connettività.
        ancoraggio ← scegliAncoraggio(stanze, corridoi, collegamenti, tiro)
        SE ancoraggio = nullo: ESCI

        corridoio ← calcDungeonCorridor(oc)
        aggiungiCorridoio(corridoio, sorgente ← ancoraggio)
        sbocchi ← sbocchiCorridoio(corridoio)
        SE sbocchi ≠ ∅: accoda(coda, sbocchi, sorgente ← corridoio)
        tentativi ← tentativi + 1

    // Gli sbocchi ancora in coda quando si raggiunge numeroStanze sono stati
    // raccolti in sbocchiAvanzati: i corridoi foglia li collegano a stanze
    // già esistenti, senza generare nuove stanze.

    collegaSbocchiAvanzati(sbocchiAvanzati)

    RESTITUISCI { stanze, corridoi, collegamenti, corridoioIngresso: ingresso }


// ---- Il cuore dell'algoritmo: uno sbocco alla volta -------------------------
PROCEDURA espandi(coda):

    // consecutiviSenzaStanza è del piano, non di questa procedura:
    // non si azzera tra un ciclo di fallback e l'altro.
    // La coda viene svuotata anche dopo aver raggiunto numeroStanze, per
    // raccogliere gli sbocchi avanzati dei corridoi.
    FINCHÉ coda non vuota:

        s ← rimuoviPrimo(coda)

        SE numero(stanze) ≥ numeroStanze ALLORA
            SE s.sorgente.tipo = 'corridoio' E s.tipo ≠ SCALE ALLORA
                aggiungi s A sbocchiAvanzati
            segna s come 'non sviluppato'
            CONTINUA

        SECONDO tipo DI s:

            CASO PORTA_STANZA, PORTA_SEGRETA:
                generaStanzaCollegata(s)
                consecutiviSenzaStanza ← 0

            CASO SCALE:
                // Nessun link tra livelli viene creato qui: si registra solo
                // l'uscita verticale del livello. Il collegamento con l'altro
                // livello resta competenza della cross-section.
                aggiungiCollegamento(
                    da ← s.sorgente,
                    a  ← { tipo: 'uscita', direzione: s.direzione },
                    via ← s)
                consecutiviSenzaStanza ← 0

            CASO SBOCCO_CORRIDORIO, INCROCIO_X, INCROCIO_T,
                 SVOLTA_SINISTRA, SVOLTA_DESTRA:

                SE consecutiviSenzaStanza ≥ MAX_CORRIDORI_CONSECUTIVI ALLORA
                    // Evita catene infinite di corridoi senza stanze:
                    // lo sbocco viene forzato a dare su una stanza.
                    generaStanzaCollegata(s convertito in PORTA_STANZA)
                    consecutiviSenzaStanza ← 0
                ALTRIMENTI
                    corridoio ← calcDungeonCorridor(oc)
                    aggiungiCorridoio(corridoio, sorgente ← s)
                    consecutiviSenzaStanza ← consecutiviSenzaStanza + 1
                    accoda(coda, sbocchiCorridoio(corridoio), sorgente ← corridoio)
```

### 2. Funzioni di supporto

```
FUNZIONE generaStanzaCollegata(sbocco):

    stanza ← generateRoom(
                 prossimoNumeroStanza,
                 profondita,
                 mostriVaganti,
                 opzioni,
                 tiro)
    prossimoNumeroStanza ← prossimoNumeroStanza + 1

    stanza.eSegreta ← (sbocco.tipo = PORTA_SEGRETA)
    aggiungiStanza(stanza)
    aggiungiCollegamento(da ← sbocco.sorgente, a ← stanza, via ← sbocco)

    // Ogni porta della stanza diventa uno sbocco da sviluppare ("e così via").
    PER OGNI porta IN stanza.doors:
        SE porta.type = 'Secret door' ALLORA
            tipo ← PORTA_SEGRETA
        ALTRIMENTI SE porta.destination = 'Corridor' ALLORA
            tipo ← SBOCCO_CORRIDORIO
        ALTRIMENTI
            tipo ← PORTA_STANZA

        accoda(coda, { tipo: tipo, sorgente: stanza, porta: porta })

    RESTITUISCI stanza


FUNZIONE sbocchiCorridoio(C):

    S ← lista vuota

    PER OGNI sezione IN C.sections:
        PER OGNI feature IN sezione.features:
            SE feature inizia con "Door on " ALLORA
                aggiungi A S { tipo: PORTA_STANZA, sorgente: C, lato: feature }
            ALTRIMENTI SE feature inizia con "Secret door:" ALLORA
                aggiungi A S { tipo: PORTA_SEGRETA, sorgente: C }

    SECONDO C.end:
        'Dead end (or reroll)'        → nessuno
        'Door/Portcullis'             → aggiungi { tipo: PORTA_STANZA, sorgente: C }
        'X intersection'              → aggiungi { tipo: INCROCIO_X, sorgente: C }
        'T intersection'              → aggiungi { tipo: INCROCIO_T, sorgente: C }
        'Left turn'                   → aggiungi { tipo: SVOLTA_SINISTRA, sorgente: C }
        'Right turn'                  → aggiungi { tipo: SVOLTA_DESTRA, sorgente: C }
        'Stairs to a deeper level'    → aggiungi { tipo: SCALE, direzione: GIU, sorgente: C }
        'Stairs to a higher level'    → aggiungi { tipo: SCALE, direzione: SU, sorgente: C }

    RESTITUISCI S


FUNZIONE esisteSboccoStanza(sbocchi):

    RESTITUISCI esiste s IN sbocchi TALE CHE
        s.tipo = PORTA_STANZA OPPURE s.tipo = PORTA_SEGRETA


FUNZIONE generaPortaLateraleCorridoio(tiro):

    lato  ← randomOptionEntry(tableDungeonCorridorDoorSide, tiro).result.toLowerCase()
    porta ← generateDoor(tiro, lato)          // position = lato, destination = 'Room'
    RESTITUISCI "Door on {lato}: {porta.type} (opens to a room)"


FUNZIONE aggiungiCorridoio(C, sorgente):

    C.id ← "C" + prossimoNumeroCorridoio
    prossimoNumeroCorridoio ← prossimoNumeroCorridoio + 1
    aggiungi C A corridoi

    SE sorgente ≠ 'Ingresso' ALLORA
        aggiungiCollegamento(da ← sorgente, a ← C, via ← 'sbocco di corridoio')
    ALTRIMENTI
        // Origine del piano del livello: non è un link tra livelli.
        aggiungiCollegamento(da ← 'Ingresso', a ← C, via ← 'ingresso')


FUNZIONE scegliAncoraggio(stanze, corridoi, collegamenti, tiro):

    candidati ← tutti i dead end dei corridoi (end = 'Dead end (or reroll)' o
                 sbocchi non sviluppati) e le porte delle stanze non ancora usate
    SE candidati = ∅: RESTITUISCI nullo
    RESTITUISCI candidati[ tiro(numero(candidati)) - 1 ]   // tiro(n) → 1..n


FUNZIONE collegaSbocchiAvanzati(sbocchiAvanzati):

    // Un corridoio è foglia se non è sorgente di nessun collegamento
    // già presente che non sia un loop.
    ramificati ← { C | esiste collegamento da C con loop = falso }

    PER OGNI s IN sbocchiAvanzati:

        SE s.sviluppato OPPURE s.sorgente.tipo ≠ 'corridoio'
           OPPURE s.tipo = SCALE OPPURE s.sorgente IN ramificati: CONTINUA

        // Non si creano archi doppi né si torna alla stanza di provenienza.
        bersagli ← stanze tali che non esiste già un collegamento
                    (s.sorgente → stanza) OPPURE (stanza → s.sorgente)
        SE bersagli = ∅: CONTINUA

        stanza ← bersagli[ tiro(numero(bersagli)) - 1 ]
        aggiungiCollegamento(da ← s.sorgente, a ← stanza, via ← s, loop ← vero)
        segna s come sviluppato
```

### 3. Come richiamarla per un solo livello (senza doppi tiri)

La procedura può essere chiamata direttamente per un livello già costruito, oppure
inserita al posto della generazione piatta delle stanze dentro `generateLevel`. In
quest'ultimo caso, l'unica modifica al codice esistente è la costruzione di `rooms`:

```
FUNZIONE generateLevel(number, depth, sublevel, options, rollFn,
                       hasDeeperLevel, hasHigherLevel):        // versione aggiornata

    factions          ← generateFactions(depth, rollFn)
    wanderingMonsters ← generateWanderingMonsters(depth, factions, rollFn)
    roomCount         ← resolveRoomCount(options, rollFn)
    relazioni         ← generateFactionRelationships(factions, rollFn)

    SE options.assembleFloorPlan ALLORA
        oc    ← { hasDeeperLevel, hasHigherLevel, rollFn }
        piano ← generaPianoLivello(roomCount, depth, wanderingMonsters, options, oc, rollFn)
        stanze ← piano.stanze
    ALTRIMENTI
        stanze ← Array.from({length: roomCount},
                    (_, i) => generateRoom(i + 1, depth, wanderingMonsters, options, rollFn))

    RESTITUISCI {
        number, depth, sublevel, roomCount,
        factions, wanderingMonsters,
        factionRelationships: relazioni,
        rooms: stanze,
        corridoi:          options.assembleFloorPlan ? piano.corridoi : [],
        collegamenti:      options.assembleFloorPlan ? piano.collegamenti : [],
        corridoioIngresso: options.assembleFloorPlan ? piano.corridoioIngresso : null
    }
```

I due flag sono passati da `generateArea`, che conosce i `depth` degli altri livelli
della stessa area; la procedura descritta in questo documento non li deriva dalla
cross-section e non tocca gli altri livelli.

## Strutture da aggiungere al modello

```
Collegamento = {
    da:   { tipo: 'corridoio' | 'stanza' | 'Ingresso' | 'uscita', id },
    a:    { tipo: 'corridoio' | 'stanza' | 'uscita', id },
    via:  'ingresso' | 'sbocco di corridoio' | DungeonDoor | sbocco
}

DungeonOptions + {
    assembleFloorPlan?: boolean      // default false: comportamento attuale invariato
}

DungeonLevel + {
    corridoi:          DungeonCorridor[]        // con id aggiuntivo
    collegamenti:      Collegamento[]
    corridoioIngresso: id del corridoio di ingresso del livello
}
```

`DungeonRoom` e `DungeonCorridor` restano invariati: i campi `eSegreta` e `id` sono
metadati del piano assemblato, non delle procedure di generazione.

## Invarianti di verifica (relative al singolo livello)

1. Il corridoio di ingresso del livello esiste e contiene almeno uno sbocco
   `PORTA_STANZA` o `PORTA_SEGRETA`, quindi può generare almeno una stanza.
2. Ogni stanza del livello è raggiungibile dal suo corridoio di ingresso seguendo
   `collegamenti` (grafo connesso; nessun elemento orfano).
3. `numero(stanze) = livello.roomCount`, oppure — solo se gli ancoraggi si esauriscono in
   tutte le riprovazioni — `numero(stanze) < livello.roomCount`; il piano restituisce
   comunque il conteggio effettivo.
4. Ogni collegamento corrisponde a un elemento generato davvero: una `Door on …` /
   `Secret door` / `end` di `calcDungeonCorridor`, una porta di `generateRoom`,
   l'ingresso del livello o un'uscita verticale.
5. Ogni collegamento con `loop = vero` ha come sorgente un corridoio foglia e come
   destinazione una stanza **già presente** nel piano: non incrementa `numero(stanze)`,
   non usa `SCALE`, non ripete un arco diretto già esistente in nessuna delle due
   direzioni ed è determinato da `tiro`. Più sbocchi dello stesso corridoio possono
   collegare stanze diverse, quindi il grafo può contenere cicli.
6. Ogni stanza e ogni corridoio provengono rispettivamente da `generateRoom` e
   `calcDungeonCorridor`: nessuna generazione "artigianale" al di fuori di essi
   (l'unica eccezione è la porta forzata del fallback, che usa comunque
   `tableDungeonCorridorDoorSide` + `generateDoor`).
7. `generateRoom` è invocato **una sola volta per stanza**: con
   `assembleFloorPlan = true` `generateLevel` non genera stanze, quindi non si
   consumano tiri duplicati e l'ordine delle stanze segue quello degli sbocchi collegati.
8. Nessuna struttura appartenente ad altri livelli o aree viene creata o modificata.

## Rifiniture opzionali (non incluse nel flusso principale)

- Un `X intersection` può generare **due** corridoi perpendicolari invece di uno solo:
  basta accodare due volte `calcDungeonCorridor(oc)` sullo stesso sbocco.
- La regola del libro "porte sulla stessa parete possono portare alla stessa stanza"
  è ora applicata nel flusso principale agli **sbocchi avanzati dei corridoi foglia**
  tramite `collegaSbocchiAvanzati`. Estenderla anche alle porte delle stanze dentro
  `generaStanzaCollegata` (con `1d6 = 1`, senza incrementare `prossimoNumeroStanza`)
  resta una rifinitura opzionale.
- Il numero esatto del quadrato in cui si apre una porta in una sezione (`1d4+1`),
  regola opzionale del libro, resta fuori dal grafo topologico e va aggiunto solo
  quando si passerà al disegno su griglia del livello.
