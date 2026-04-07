import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "microcontrollers" },
      update: {},
      create: {
        name: "Microcontrollers",
        slug: "microcontrollers",
        description: "Arduino, ESP32, STM32 and other microcontroller boards",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "sensors" },
      update: {},
      create: {
        name: "Sensors",
        slug: "sensors",
        description: "Temperature, pressure, motion, proximity and more",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "motors" },
      update: {},
      create: {
        name: "Motors & Actuators",
        slug: "motors",
        description: "Stepper motors, servo motors, DC motors and drivers",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "power-modules" },
      update: {},
      create: {
        name: "Power Modules",
        slug: "power-modules",
        description: "Buck converters, regulators, power supply modules",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "plc-components" },
      update: {},
      create: {
        name: "PLC Components",
        slug: "plc-components",
        description: "Programmable logic controllers and accessories",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "development-boards" },
      update: {},
      create: {
        name: "Development Boards",
        slug: "development-boards",
        description: "Raspberry Pi, Jetson Nano and other SBCs",
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "motor-drivers" },
      update: {},
      create: {
        name: "Motor Drivers",
        slug: "motor-drivers",
        description: "H-bridge drivers, stepper controllers, servo drivers",
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "connectors" },
      update: {},
      create: {
        name: "Connectors & Cables",
        slug: "connectors",
        description: "JST, Dupont, terminal blocks and wiring accessories",
        sortOrder: 8,
      },
    }),
    prisma.category.upsert({
      where: { slug: "robotics" },
      update: {},
      create: {
        name: "Robotics Accessories",
        slug: "robotics",
        description: "Chassis, wheels, brackets and robot building parts",
        sortOrder: 9,
      },
    }),
    prisma.category.upsert({
      where: { slug: "tools" },
      update: {},
      create: {
        name: "Tools & Equipment",
        slug: "tools",
        description: "Soldering, measurement and workshop tools",
        sortOrder: 10,
      },
    }),
  ]);

  // Brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "arduino" },
      update: {},
      create: {
        name: "Arduino",
        slug: "arduino",
        description: "Open-source electronics platform",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "espressif" },
      update: {},
      create: {
        name: "Espressif",
        slug: "espressif",
        description: "ESP8266 and ESP32 chip maker",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "raspberry-pi" },
      update: {},
      create: {
        name: "Raspberry Pi",
        slug: "raspberry-pi",
        description: "Single-board computers",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "siemens" },
      update: {},
      create: {
        name: "Siemens",
        slug: "siemens",
        description: "Industrial automation and PLC systems",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "stmicroelectronics" },
      update: {},
      create: {
        name: "STMicroelectronics",
        slug: "stmicroelectronics",
        description: "STM32 microcontrollers and components",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "generic" },
      update: {},
      create: {
        name: "Generic",
        slug: "generic",
        description: "Generic / unbranded components",
      },
    }),
  ]);

  const [
    catMCU,
    catSensors,
    catMotors,
    catPower,
    ,
    catDev,
    catDrivers,
    ,
    ,
    ,
  ] = categories;

  const [brandArduino, brandEsp, brandRPi, , , brandGeneric] = brands;

  // Products
  const product1 = await prisma.product.upsert({
    where: { slug: "arduino-uno-r3" },
    update: { imageUrl: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80&fit=crop" },
    create: {
      categoryId: catMCU.id,
      brandId: brandArduino.id,
      name: "Arduino Uno R3",
      slug: "arduino-uno-r3",
      sku: "MCU-001",
      shortDescription: "The classic Arduino Uno R3 microcontroller board",
      fullDescription:
        "The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header and a reset button. Ideal for learning electronics and prototyping.",
      technicalSummary: "ATmega328P @ 16MHz, 14 I/O pins, USB-B programming",
      price: 45000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 25,
      isFeatured: true,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=600&q=80&fit=crop",
      metaTitle: "Arduino Uno R3 | Saviour Mechatronics",
      metaDescription: "Buy Arduino Uno R3 in Uganda. ATmega328P microcontroller board for prototyping and learning.",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product1.id, specName: "Microcontroller", specValue: "ATmega328P", sortOrder: 1 },
      { productId: product1.id, specName: "Operating Voltage", specValue: "5", specUnit: "V", sortOrder: 2 },
      { productId: product1.id, specName: "Input Voltage", specValue: "7-12", specUnit: "V", sortOrder: 3 },
      { productId: product1.id, specName: "Digital I/O Pins", specValue: "14", sortOrder: 4 },
      { productId: product1.id, specName: "Analog Input Pins", specValue: "6", sortOrder: 5 },
      { productId: product1.id, specName: "Flash Memory", specValue: "32", specUnit: "KB", sortOrder: 6 },
      { productId: product1.id, specName: "Clock Speed", specValue: "16", specUnit: "MHz", sortOrder: 7 },
    ],
  });

  const product2 = await prisma.product.upsert({
    where: { slug: "esp32-dev-board" },
    update: { imageUrl: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=600&q=80&fit=crop" },
    create: {
      categoryId: catMCU.id,
      brandId: brandEsp.id,
      name: "ESP32 Development Board",
      slug: "esp32-dev-board",
      sku: "MCU-002",
      shortDescription: "Dual-core WiFi & Bluetooth microcontroller",
      fullDescription:
        "The ESP32 is a feature-rich MCU with integrated WiFi and Bluetooth connectivity for a wide-range of applications. Built-in dual-core processor, rich peripheral set and ultra-low power consumption make it ideal for IoT projects.",
      technicalSummary: "Xtensa LX6 dual-core @ 240MHz, WiFi 802.11b/g/n, Bluetooth 4.2",
      price: 35000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 40,
      isFeatured: true,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product2.id, specName: "CPU", specValue: "Xtensa LX6 dual-core", sortOrder: 1 },
      { productId: product2.id, specName: "Clock Speed", specValue: "240", specUnit: "MHz", sortOrder: 2 },
      { productId: product2.id, specName: "Operating Voltage", specValue: "3.3", specUnit: "V", sortOrder: 3 },
      { productId: product2.id, specName: "WiFi", specValue: "802.11 b/g/n", sortOrder: 4 },
      { productId: product2.id, specName: "Bluetooth", specValue: "4.2 BR/EDR & BLE", sortOrder: 5 },
      { productId: product2.id, specName: "Flash Memory", specValue: "4", specUnit: "MB", sortOrder: 6 },
      { productId: product2.id, specName: "GPIO Pins", specValue: "38", sortOrder: 7 },
    ],
  });

  const product3 = await prisma.product.upsert({
    where: { slug: "nema17-stepper-motor" },
    update: { imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&q=80&fit=crop" },
    create: {
      categoryId: catMotors.id,
      brandId: brandGeneric.id,
      name: "NEMA 17 Stepper Motor",
      slug: "nema17-stepper-motor",
      sku: "MOT-014",
      shortDescription: "Bipolar stepper motor, 1.8° step angle, 40Ncm torque",
      fullDescription:
        "High quality NEMA 17 stepper motor suitable for 3D printers, CNC machines and robotics. Smooth operation, high torque and reliable performance. Compatible with A4988, DRV8825 and TMC2208 drivers.",
      technicalSummary: "1.8° step, 40Ncm holding torque, 1.5A rated current",
      price: 55000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 18,
      isFeatured: true,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product3.id, specName: "Step Angle", specValue: "1.8", specUnit: "°", sortOrder: 1 },
      { productId: product3.id, specName: "Rated Voltage", specValue: "12", specUnit: "V", sortOrder: 2 },
      { productId: product3.id, specName: "Rated Current", specValue: "1.5", specUnit: "A", sortOrder: 3 },
      { productId: product3.id, specName: "Holding Torque", specValue: "40", specUnit: "Ncm", sortOrder: 4 },
      { productId: product3.id, specName: "Phase Resistance", specValue: "1.5", specUnit: "Ω", sortOrder: 5 },
      { productId: product3.id, specName: "Shaft Diameter", specValue: "5", specUnit: "mm", sortOrder: 6 },
      { productId: product3.id, specName: "Weight", specValue: "280", specUnit: "g", sortOrder: 7 },
    ],
  });

  const product4 = await prisma.product.upsert({
    where: { slug: "lm2596-buck-converter" },
    update: { imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&fit=crop" },
    create: {
      categoryId: catPower.id,
      brandId: brandGeneric.id,
      name: "LM2596 Buck Converter Module",
      slug: "lm2596-buck-converter",
      sku: "PWR-008",
      shortDescription: "DC-DC step-down adjustable voltage regulator module",
      fullDescription:
        "Adjustable step-down DC-DC converter module based on the LM2596 chip. Efficient power conversion with adjustable output voltage. Includes LED power indicator and screw terminal connections.",
      technicalSummary: "Input 4-40V, Output 1.25-37V adjustable, 3A max",
      price: 12000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 60,
      isFeatured: true,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product4.id, specName: "Input Voltage", specValue: "4-40", specUnit: "V", sortOrder: 1 },
      { productId: product4.id, specName: "Output Voltage", specValue: "1.25-37", specUnit: "V", sortOrder: 2 },
      { productId: product4.id, specName: "Output Current", specValue: "3", specUnit: "A", sortOrder: 3 },
      { productId: product4.id, specName: "Efficiency", specValue: "92", specUnit: "%", sortOrder: 4 },
      { productId: product4.id, specName: "Switching Frequency", specValue: "150", specUnit: "kHz", sortOrder: 5 },
    ],
  });

  const product5 = await prisma.product.upsert({
    where: { slug: "dht22-sensor" },
    update: { imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop" },
    create: {
      categoryId: catSensors.id,
      brandId: brandGeneric.id,
      name: "DHT22 Temperature & Humidity Sensor",
      slug: "dht22-sensor",
      sku: "SEN-011",
      shortDescription: "High-precision digital temperature and humidity sensor",
      fullDescription:
        "The DHT22 is a reliable digital humidity and temperature sensor. It uses a capacitive humidity sensor and a thermistor to measure the surrounding air and outputs a digital signal on the data pin. Suitable for HVAC, weather stations and smart home projects.",
      technicalSummary: "Temperature -40 to +80°C, Humidity 0-100% RH, single-wire interface",
      price: 18000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 35,
      isFeatured: false,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product5.id, specName: "Temperature Range", specValue: "-40 to +80", specUnit: "°C", sortOrder: 1 },
      { productId: product5.id, specName: "Temperature Accuracy", specValue: "±0.5", specUnit: "°C", sortOrder: 2 },
      { productId: product5.id, specName: "Humidity Range", specValue: "0-100", specUnit: "% RH", sortOrder: 3 },
      { productId: product5.id, specName: "Humidity Accuracy", specValue: "±2-5", specUnit: "% RH", sortOrder: 4 },
      { productId: product5.id, specName: "Operating Voltage", specValue: "3.3-6", specUnit: "V", sortOrder: 5 },
      { productId: product5.id, specName: "Interface", specValue: "Single-wire", sortOrder: 6 },
      { productId: product5.id, specName: "Sampling Rate", specValue: "0.5", specUnit: "Hz", sortOrder: 7 },
    ],
  });

  const product6 = await prisma.product.upsert({
    where: { slug: "a4988-stepper-driver" },
    update: { imageUrl: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80&fit=crop" },
    create: {
      categoryId: catDrivers.id,
      brandId: brandGeneric.id,
      name: "A4988 Stepper Motor Driver",
      slug: "a4988-stepper-driver",
      sku: "DRV-003",
      shortDescription: "Microstepping bipolar stepper motor driver module",
      fullDescription:
        "The A4988 is a complete microstepping motor driver with built-in translator for easy operation. Supports full, 1/2, 1/4, 1/8 and 1/16 microstepping. Includes adjustable current control and over-temperature thermal shutdown.",
      technicalSummary: "Up to 35V, 2A peak, microstepping up to 1/16",
      price: 15000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 45,
      isFeatured: false,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product6.id, specName: "Motor Supply Voltage", specValue: "8-35", specUnit: "V", sortOrder: 1 },
      { productId: product6.id, specName: "Logic Voltage", specValue: "3.3-5", specUnit: "V", sortOrder: 2 },
      { productId: product6.id, specName: "Peak Output Current", specValue: "2", specUnit: "A", sortOrder: 3 },
      { productId: product6.id, specName: "Continuous Current", specValue: "1", specUnit: "A", sortOrder: 4 },
      { productId: product6.id, specName: "Microstepping", specValue: "Full, 1/2, 1/4, 1/8, 1/16", sortOrder: 5 },
    ],
  });

  const product7 = await prisma.product.upsert({
    where: { slug: "raspberry-pi-4b-4gb" },
    update: { imageUrl: "https://images.unsplash.com/photo-1580584126903-c17d41830450?w=600&q=80&fit=crop" },
    create: {
      categoryId: catDev.id,
      brandId: brandRPi.id,
      name: "Raspberry Pi 4 Model B (4GB)",
      slug: "raspberry-pi-4b-4gb",
      sku: "DEV-005",
      shortDescription: "Quad-core 64-bit SBC with 4GB RAM",
      fullDescription:
        "The Raspberry Pi 4 Model B is the latest product in the popular Raspberry Pi range of computers. It offers ground-breaking increases in processor speed, multimedia performance, memory, and connectivity compared to the prior-generation Raspberry Pi 3.",
      technicalSummary: "Cortex-A72 @ 1.8GHz, 4GB LPDDR4, dual HDMI 4K",
      price: 380000,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "limited_availability",
      stockQuantity: 5,
      isFeatured: true,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1580584126903-c17d41830450?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product7.id, specName: "Processor", specValue: "Broadcom BCM2711, Quad-core Cortex-A72", sortOrder: 1 },
      { productId: product7.id, specName: "Clock Speed", specValue: "1.8", specUnit: "GHz", sortOrder: 2 },
      { productId: product7.id, specName: "RAM", specValue: "4", specUnit: "GB LPDDR4", sortOrder: 3 },
      { productId: product7.id, specName: "WiFi", specValue: "802.11ac", sortOrder: 4 },
      { productId: product7.id, specName: "Bluetooth", specValue: "5.0", sortOrder: 5 },
      { productId: product7.id, specName: "USB Ports", specValue: "2x USB 3.0, 2x USB 2.0", sortOrder: 6 },
      { productId: product7.id, specName: "GPIO", specValue: "40-pin header", sortOrder: 7 },
      { productId: product7.id, specName: "Display", specValue: "2x Micro HDMI (4K)", sortOrder: 8 },
    ],
  });

  const product8 = await prisma.product.upsert({
    where: { slug: "hc-sr04-ultrasonic" },
    update: { imageUrl: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&q=80&fit=crop" },
    create: {
      categoryId: catSensors.id,
      brandId: brandGeneric.id,
      name: "HC-SR04 Ultrasonic Distance Sensor",
      slug: "hc-sr04-ultrasonic",
      sku: "SEN-002",
      shortDescription: "Non-contact ultrasonic distance measurement sensor",
      fullDescription:
        "The HC-SR04 uses sonar to determine distance to an object. It offers excellent non-contact range detection with high accuracy and stable readings in an easy-to-use package. Used in robots, obstacle avoidance and proximity detection.",
      technicalSummary: "2cm-400cm range, 3mm accuracy, 5V operation",
      price: 8500,
      priceVisibilityMode: "show_exact_price",
      stockStatus: "in_stock",
      stockQuantity: 80,
      isFeatured: false,
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&q=80&fit=crop",
    },
  });

  await prisma.productSpecification.createMany({
    
    data: [
      { productId: product8.id, specName: "Operating Voltage", specValue: "5", specUnit: "V", sortOrder: 1 },
      { productId: product8.id, specName: "Measuring Range", specValue: "2-400", specUnit: "cm", sortOrder: 2 },
      { productId: product8.id, specName: "Accuracy", specValue: "±3", specUnit: "mm", sortOrder: 3 },
      { productId: product8.id, specName: "Measuring Angle", specValue: "15", specUnit: "°", sortOrder: 4 },
      { productId: product8.id, specName: "Trigger Input Signal", specValue: "10µs TTL pulse", sortOrder: 5 },
    ],
  });

  // Add related products
  try {
    await prisma.productRelatedItem.createMany({
      
      data: [
        { productId: product3.id, relatedProductId: product6.id, relationType: "accessory" },
        { productId: product6.id, relatedProductId: product3.id, relationType: "compatible_with" },
        { productId: product1.id, relatedProductId: product5.id, relationType: "compatible_with" },
        { productId: product1.id, relatedProductId: product8.id, relationType: "compatible_with" },
      ],
    });
  } catch (e) {
    // ignore duplicate errors
  }

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@saviour.com" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "admin@saviour.com",
      passwordHash,
      role: "super_admin",
      isActive: true,
    },
  });

  console.log("Seeding complete.");
  console.log("Admin credentials: admin@saviour.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
