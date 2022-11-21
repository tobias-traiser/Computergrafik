import {Bar} from "./Bar/bar";


async function main() {

    let bar = new Bar();
    await bar.init()
    bar.start()
}

main().catch((err) => {
    console.error(err);
});
