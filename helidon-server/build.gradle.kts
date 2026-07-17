plugins {
    application
    id("io.freefair.lombok") version "9.5.0"
}

repositories {
    mavenCentral()
}

val helidonVersion = "4.5.0"

dependencies {


    implementation(
        enforcedPlatform(
            "io.helidon:helidon-dependencies:$helidonVersion"
        )
    )



    implementation("io.helidon.webserver:helidon-webserver")
    implementation("io.helidon.config:helidon-config")
    implementation("io.helidon.config:helidon-config-yaml")
    implementation("io.helidon.dbclient:helidon-dbclient")
    implementation("io.helidon.dbclient:helidon-dbclient-jdbc")
    implementation("io.helidon.dbclient:helidon-dbclient-hikari")


    //Para leer JSON
    implementation("io.helidon.http.media:helidon-http-media-jackson")

    implementation("com.fasterxml.jackson.core:jackson-databind")



    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.slf4j:slf4j-jdk14")
}

application {
    mainClass.set("com.programacion.web.HelidonServerMain")
}



