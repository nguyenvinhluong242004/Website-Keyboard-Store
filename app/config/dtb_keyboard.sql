DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS EmailForReceivingInfo;
DROP TABLE IF EXISTS Poster;
DROP TABLE IF EXISTS OrderDetail;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS GroupByProduct;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Brand;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Address;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS AccountType;
DROP TABLE IF EXISTS ShoppingCart;

CREATE TABLE Admin (
	Email VARCHAR(255) Primary Key,
	Password VARCHAR(255) NOT NULL
);

Create TABLE EmailForReceivingInfo(
	Email VARCHAR(255)
);

CREATE TABLE Brand (
    BrandID SERIAL PRIMARY KEY,
	Country VARCHAR(255),
	BrandName VARCHAR(255) NOT NULL
);

CREATE TABLE Category (
    CategoryID SERIAL PRIMARY KEY,
	ImagePath VARCHAR(255),
	CategoryName VARCHAR(255) NOT NULL
);

CREATE TABLE Poster (
    PosterID SERIAL PRIMARY KEY,
    ImagePath VARCHAR(255),
    ProductLink TEXT NOT NULL
);

CREATE TABLE Product (
	ProductID SERIAL PRIMARY KEY,
	ProductName VARCHAR(255),
	Specification VARCHAR(255),
	OldPrice INT,
	CurrentPrice INT,
	EstimateArrive INT, --The number of days the customer might wait to be delivered when they order
	ImagePath VARCHAR(255),
	Description Text,
	CategoryID INT,
	BrandID INT,
	Quantity INT,
	Type INT, -- 1: Instock - 2: Groupby
	FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
	FOREIGN KEY (BrandID) REFERENCES Brand(BrandID)
);

CREATE TABLE Review (
	ReviewID SERIAL PRIMARY KEY,
	ProductID INT,
	Email VARCHAR(255),
	ReviewDate Date,
	Comment Text,
	Stars INT NOT NULL CHECK (Stars IN (1, 2, 3, 4, 5)), -- 1,2,3,4 or 5 stars
	FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

CREATE TABLE AccountType (
    Email VARCHAR(255) PRIMARY KEY,
	PasswordOrGoogleID VARCHAR(255) NOT NULL,
	Type VARCHAR(50) NOT NULL CHECK (Type IN ('Email', 'Google')) -- whether the account is "Normal Email" or "Google"
);

CREATE TABLE Users (
	UserID SERIAL PRIMARY KEY,
	Username VARCHAR(255) Not NULL,
	Email VARCHAR(255) UNIQUE,
	Phone VARCHAR(10),
	FOREIGN KEY (Email) REFERENCES AccountType(Email)
);

CREATE TABLE Address (
    ID SERIAL PRIMARY KEY,                -- ID tự tăng
    UserID INT NOT NULL,                      -- Khóa ngoại tham chiếu tới bảng Users
    Province VARCHAR(255) NOT NULL,           -- Tỉnh/Thành phố
    District VARCHAR(255) NOT NULL,           -- Quận/Huyện
    Ward VARCHAR(255) NOT NULL,               -- Phường/Xã
    Street VARCHAR(255) NOT NULL,             -- Đường
    FOREIGN KEY (UserID) REFERENCES Users(UserID) -- Ràng buộc khóa ngoại
);


CREATE TABLE Orders (
	OrderID SERIAL PRIMARY KEY,
	UserID INT,
	UserPaid Int,
	TotalAmount Int,
	OrderDate DATE,
	OrderStatus VARCHAR(50) NOT NULL CHECK (OrderStatus IN ('Pending Approval', 'Refuse', 'Approved', 'Shipped', 'Completed')),
	PaymentMethod VARCHAR(50) NOT NULL CHECK (PaymentMethod IN ('Money Transfer', 'Pay In Cash')),
	FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE GroupByProduct(
	GroupByID SERIAL PRIMARY KEY,
	StartDate Date,
	EndDate Date,
	EstimateArrive Date, --The number of days the customer might wait to be delivered when they order
	GroupByPrice INT,
	MinPariticipants INT,
	CurrentParticipants INT,
	ProductID INT,
	FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

CREATE TABLE OrderDetail(
   OrderID INT,
   NumericalOrder INT,
   ProductID INT,
   Quantity INT,
   UnitPrice INT,-- The money customer will pay aften mutiple the price of the product with the quantity
   GroupByID INT,
   Primary Key(OrderID, NumericalOrder),
   FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
   FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
   FOREIGN KEY (GroupByID) REFERENCES GroupByProduct(GroupByID)
);

CREATE TABLE ShoppingCart (
    id SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION calculate_unit_price()
RETURNS TRIGGER AS $$
BEGIN
    -- If GroupByID is NULL, use the Product's CurrentPrice
    IF NEW.GroupByID IS NULL THEN
        SELECT CurrentPrice
        INTO NEW.UnitPrice
        FROM Product
        WHERE ProductID = NEW.ProductID;

        -- Multiply the product price with the quantity
        NEW.UnitPrice = NEW.UnitPrice * NEW.Quantity;
    ELSE
        -- If GroupByID is NOT NULL, use the ProductID from the GroupByProduct table
        SELECT CurrentPrice
        INTO NEW.UnitPrice
        FROM Product
        WHERE ProductID = (
            SELECT ProductID
            FROM GroupByProduct
            WHERE GroupByID = NEW.GroupByID
        );

        -- Multiply the group-buy product price with the quantity
        NEW.UnitPrice = NEW.UnitPrice * NEW.Quantity;
    END IF;

    -- Return the modified row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to OrderDetail
CREATE TRIGGER trg_calculate_unit_price
BEFORE INSERT OR UPDATE ON OrderDetail
FOR EACH ROW
EXECUTE FUNCTION calculate_unit_price();


-- Insert values into Admin
INSERT INTO Admin (Email, Password) VALUES
('admin1@example.com', 'password123');


-- Insert values into Brand
INSERT INTO Brand (Country, BrandName) VALUES
('USA', 'KeyChron'),
('China', 'Akko'),
('Germany', 'Cherry'),
('Japan', 'Ducky'),
('South Korea', 'Leopold'),
('USA', 'Corsair'),
('Taiwan', 'Varmilo'),
('China', 'Royal Kludge'),
('Canada', 'Drop'),
('USA', 'Logitech');


-- Insert values into Category
INSERT INTO Category (ImagePath, CategoryName) VALUES
('/category/kecap.jpg', 'Kecap'),
('/category/kitPhim.jpg', 'Kit Phim'),
('/category/phuKien.jpg', 'Accessories'),
('/category/switch.jpg', 'Switch');


-- Insert values into Poster
INSERT INTO Poster (ImagePath, ProductLink) VALUES
('/poster/1.jpg', 'https://example.com'),
('/poster/2.jpg', 'https://example.com'),
('/poster/3.jpg', 'https://example.com'),
('/poster/4.jpg', 'https://example.com'),
('/poster/5.jpg', 'https://example.com');


-- Insert values into Product
INSERT INTO Product (ProductName, Specification, OldPrice, CurrentPrice, EstimateArrive, ImagePath, Description, CategoryID, BrandID, Quantity, Type) VALUES
('KeyChron K2', 'Mechanical keyboard with Bluetooth and wired connections, RGB backlighting, and Gateron switches. Compatible with macOS and Windows.', 100, 90, 5, '/image/1', 
    'The KeyChron K2 is a compact and stylish mechanical keyboard that combines functionality, durability, and versatility. It features a wireless design, vibrant RGB backlighting, and seamless compatibility with macOS, Windows, and Android. Built with precision for typists and gamers, the K2 provides tactile feedback and smooth keystrokes, making it ideal for long working hours or immersive gaming sessions. Its elegant design and aluminum frame ensure durability, while its compact layout saves desk space without compromising usability. The K2 is the perfect blend of performance and aesthetics, tailored for professionals and enthusiasts alike.', 
    1, 1, 0, 2),
('Logitech MX Keys', 'Wireless keyboard with Bluetooth technology, metal keycaps, slim design, and integrates with Logitech Flow devices.', 120, 110, 7, '/image/2', 
    'The Logitech MX Keys offers an exceptional typing experience with unparalleled precision and comfort. Designed for professionals, it boasts smart illumination that adjusts to your environment, making it ideal for both day and night usage. The advanced low-profile keys deliver a fluid, natural, and responsive typing feel. Its wireless functionality supports multi-device pairing, enabling seamless transitions between devices. The premium build quality, combined with long battery life and thoughtful ergonomics, makes the MX Keys an essential tool for those who demand productivity without compromise.', 
    2, 2, 2, 1),
('Corsair K70', 'Mechanical keyboard with Cherry MX switches, RGB backlighting, macro keys, and a durable metal frame.', 150, 140, 3, '/image/3', 
    'The Corsair K70 is a top-tier mechanical gaming keyboard designed for serious gamers. Equipped with Cherry MX Red switches, it provides precise and responsive keypresses ideal for both gaming and typing. Its rugged aluminum frame ensures long-lasting durability, while per-key RGB lighting allows for full customization to match your setup. The K70 includes advanced anti-ghosting, dedicated multimedia controls, and a detachable wrist rest for extended gaming comfort. With its superior performance and build quality, the Corsair K70 elevates your gaming experience to the next level.', 
    3, 3, 4, 1),
('Razer BlackWidow V3', 'Mechanical keyboard with Razer Green switches, RGB lighting, and water and dust resistance.', 180, 170, 4, '/image/4', 
    'The Razer BlackWidow V3 is a high-performance mechanical keyboard tailored for gamers seeking precision and durability. Featuring tactile and clicky Green switches, it delivers a satisfying typing and gaming experience. The BlackWidow V3 offers wireless connectivity for a clutter-free setup and customizable RGB lighting through Razer Chroma, allowing users to personalize their gaming ambiance. Its durable build, advanced software integration, and ergonomic design make it an essential companion for competitive gaming and extended play sessions.', 
    4, 4, 6, 1),
('SteelSeries Apex Pro', 'Mechanical keyboard with adjustable actuation switches, RGB per-key lighting, and an aluminum frame.', 200, 190, 6, '/image/5', 
    'The SteelSeries Apex Pro is a revolutionary mechanical keyboard that redefines gaming and productivity. Featuring OmniPoint adjustable switches, it allows users to customize actuation points for unparalleled responsiveness. The keyboard’s aluminum frame ensures unmatched durability, while its per-key RGB lighting offers limitless customization. The integrated OLED Smart Display provides real-time information and game integration, making the Apex Pro a versatile choice for gamers, creators, and professionals. With its advanced features and ergonomic design, the Apex Pro stands as a pinnacle of keyboard innovation.', 
    1, 5, 8, 2),
('KeyChron C1', 'Wired mechanical keyboard with Gateron switches, white backlighting, and a compact design.', 80, 70, 2, '/image/6', 
    'The KeyChron C1 is an affordable and compact mechanical keyboard that provides all the essentials without compromising quality. Its wired connection ensures low latency and reliable performance, while the vibrant RGB backlighting enhances your workspace aesthetics. Designed for both professionals and gamers, the C1 features a minimalist layout that saves desk space and improves typing ergonomics. With a durable build and cross-platform compatibility, the KeyChron C1 is an excellent choice for anyone seeking a reliable and stylish keyboard on a budget.', 
    3, 1, 0, 1),
('HyperX Alloy Origins', 'Mechanical keyboard with HyperX Aqua switches, RGB backlighting, aluminum frame, and N-Key rollover.', 110, 95, 5, '/image/7', 
    'The HyperX Alloy Origins is a compact and portable mechanical keyboard designed for gamers who value precision and portability. Equipped with HyperX’s signature linear switches, it delivers smooth keystrokes with minimal actuation force, making it ideal for both gaming and typing. Its aircraft-grade aluminum body ensures long-term durability, while customizable RGB lighting provides a personalized gaming experience. The Alloy Origins is perfect for gamers who demand performance and style in a travel-friendly package.', 
    1, 6, 20, 1),
('Logitech G Pro X', 'Mechanical keyboard with hot-swappable switches, RGB lighting, and a compact design tailored for pro gamers.', 130, 120, 4, '/image/8', 
    'The Logitech G Pro X is an advanced keyboard designed to adapt to your needs, offering hot-swappable switches for ultimate customization. Built for competitive gamers and professionals, this wireless keyboard ensures high-speed connectivity and minimal latency. Its robust design includes durable materials, while the customizable RGB lighting provides vibrant visual effects. With its compact layout and ergonomic features, the Logitech G Pro X is an excellent choice for users seeking precision, flexibility, and top-notch performance.', 
    2, 2, 0, 1),
('Anne Pro 2', '60% mechanical keyboard with Bluetooth connectivity, RGB backlighting, and Gateron or Kailh switches.', 100, 85, 5, '/image/9', 
    'The Anne Pro 2 is a compact and minimalist mechanical keyboard that delivers exceptional performance and portability. Featuring wireless functionality and vibrant RGB backlighting, it caters to gamers, coders, and typists who demand versatility. The keyboard’s compact design saves desk space without sacrificing usability, and its customizable keys provide endless possibilities for personalization. With long battery life and a solid build, the Anne Pro 2 is a reliable companion for both work and play.', 
    4, 7, 22, 1),
('Ducky One 2 Mini', '60% mechanical keyboard with Cherry MX switches, RGB backlighting, and durable PBT keycaps.', 95, 85, 3, '/image/10', 
    'The Ducky One 2 Mini is a small but powerful mechanical keyboard that stands out for its exceptional build quality and vibrant RGB lighting. Designed for gamers and typists who prefer a compact form factor, it features responsive keys and customizable layouts. Its lightweight design makes it portable and easy to carry, while the durable construction ensures long-lasting performance. The Ducky One 2 Mini is perfect for those seeking a keyboard that combines functionality, aesthetics, and portability.', 
    1, 8, 24, 2),
('Razer Huntsman Mini', '60% mechanical keyboard with Razer Optical switches, RGB lighting, and a compact design.', 130, 115, 4, '/image/11', 
    'The Razer Huntsman Mini is an ultra-compact mechanical keyboard that delivers cutting-edge performance with optical switches for lightning-fast response times. Ideal for gamers and minimalists, it offers customizable RGB lighting through Razer Chroma and durable PBT keycaps for added reliability. Its lightweight design ensures portability, making it perfect for on-the-go gaming setups. The Huntsman Mini combines advanced technology, premium materials, and ergonomic features to provide an unparalleled gaming experience.', 
    3, 4, 27, 1),
('Corsair K95', 'Mechanical keyboard with Cherry MX switches, RGB backlighting, macro keys, and a durable aluminum frame.', 220, 210, 7, '/image/12', 
    'The Corsair K95 is the ultimate gaming keyboard, featuring six dedicated macro keys and Cherry MX switches for maximum precision. Its robust aluminum frame ensures durability, while the customizable RGB lighting enhances your gaming ambiance. The K95 includes advanced anti-ghosting, multimedia controls, and a detachable wrist rest for superior comfort. Designed for gamers who demand top-tier performance, the Corsair K95 is packed with features to give you an edge in any competitive setting.', 
    4, 3, 23, 1),
('Asus ROG Strix Scope', 'Mechanical keyboard with Cherry MX switches, RGB backlighting, anti-ghosting mode, and a metal frame.', 150, 140, 6, '/image/13', 
    'The Asus ROG Strix Scope is a gaming keyboard designed for FPS enthusiasts. Equipped with Cherry MX Red switches, it offers smooth and responsive keystrokes for fast-paced gaming. Its durable construction and stealth-inspired design make it a stylish addition to any setup. The keyboard includes customizable RGB lighting, advanced anti-ghosting, and macro functionality, ensuring an optimized gaming experience. With its ergonomic layout and premium features, the ROG Strix Scope is built for performance and durability.', 
    1, 9, 0, 1),
('KeyChron K6', '65% mechanical keyboard with Bluetooth and wired connections, Gateron switches, RGB backlighting, and a compact design.', 90, 85, 5, '/image/14', 
    'The KeyChron K6 is a compact wireless mechanical keyboard that blends style and functionality. Designed for multitaskers, it features seamless Bluetooth connectivity and vibrant RGB backlighting. Its ergonomic layout saves desk space, while the hot-swappable switches allow for easy customization. Built with an aluminum frame for durability, the K6 is compatible with multiple platforms, making it a versatile choice for professionals, gamers, and hobbyists. The KeyChron K6 combines compact design with powerful features to enhance productivity and creativity.', 
    1, 1, 6, 1),
('Logitech K780', 'Wireless multi-device keyboard with Bluetooth and a built-in stand for smartphones and tablets.', 70, 65, 4, '/image/15', 
    'The Logitech K780 is a versatile wireless keyboard designed for seamless multi-device usage. With its ability to switch between devices effortlessly, it is perfect for users who work across multiple platforms. The ergonomic design ensures comfortable typing, while the durable construction guarantees long-term reliability. Its compact layout and integrated cradle for smartphones and tablets make it an ideal solution for productivity and convenience on the go. The Logitech K780 offers a perfect blend of functionality, portability, and comfort.', 
    2, 2, 8, 2),
('Razer Ornata V2', 'Hybrid mechanical keyboard with Razer Mecha-Membrane switches, RGB backlighting, and dedicated media controls.', 100, 90, 3, '/image/16', 'Razer Ornata V2 combines mechanical and membrane switches for a unique tactile typing experience, featuring customizable RGB Chroma lighting and dedicated media controls for enhanced gaming and productivity.', 3, 4, 0, 1),
('Corsair K65 RGB Mini', '60% mechanical keyboard with Cherry MX switches, RGB backlighting, and a compact design.', 130, 120, 5, '/image/17', 'Corsair K65 RGB Mini is a compact 60% keyboard designed for portability without sacrificing performance. With dynamic RGB backlighting and customizable keys, it is perfect for gamers on the go.', 4, 3, 10, 1),
('SteelSeries Apex 7', 'Mechanical keyboard with SteelSeries QX2 switches, RGB backlighting, and a metal frame.', 180, 170, 6, '/image/18', 'The SteelSeries Apex 7 features an OLED display for notifications, settings, and in-game data, with Cherry MX mechanical switches, providing a superior and customizable gaming experience.', 1, 5, 9, 1),
('Logitech G815', 'Mechanical keyboard with low-profile switches, RGB backlighting, and a slim design.', 200, 190, 7, '/image/19', 'Logitech G815 offers an ultra-slim design with low-profile GL mechanical switches for faster response and greater precision, all while providing customizable RGB lighting and a robust build.', 2, 2, 11, 1),
('KeyChron Q2', 'Full-size mechanical keyboard with Bluetooth and wired options, Gateron switches, and RGB backlighting.', 150, 140, 4, '/image/20', 'KeyChron Q2 is a premium mechanical keyboard with a solid aluminum body, hot-swappable keys, and customizable RGB lighting, ideal for both typing and gaming enthusiasts.', 1, 1, 23, 2),
('Redragon K552', 'Budget mechanical keyboard with Redragon switches, RGB backlighting, and a compact design.', 40, 35, 2, '/image/21', 'The Redragon K552 features a compact and sturdy layout with mechanical switches, providing a reliable and affordable gaming experience with customizable RGB backlighting for a personalized touch.', 3, 10, 0, 1),
('Roccat Vulcan 121', 'Mechanical keyboard with Titan switches, RGB backlighting, and an anodized aluminum frame.', 160, 150, 5, '/image/22', 'The Roccat Vulcan 121 uses tactile Titan switches for fast and responsive typing. With RGB AIMO lighting and an aluminum frame, it provides both durability and style for gamers and professionals alike.', 1, 9, 24, 1),
('Logitech G915', 'Wireless mechanical keyboard with low-profile switches, RGB backlighting, and a slim, premium design.', 230, 220, 6, '/image/23', 'Logitech G915 is a premium wireless mechanical keyboard with low-profile switches for fast keystrokes, RGB LIGHTSYNC technology, and a slim yet durable build, offering the perfect blend of performance and style.', 2, 2, 22, 1),
('HyperX Alloy FPS Pro', 'Compact mechanical keyboard with Cherry MX switches, RGB backlighting, and a durable frame.', 80, 70, 4, '/image/24', 'HyperX Alloy FPS Pro is a tenkeyless mechanical keyboard designed for FPS gamers. It features durable switches, red LED backlighting, and a solid steel frame for enhanced portability and responsiveness.', 1, 6, 16, 1),
('Ducky Shine 7', 'Full-size mechanical keyboard with Cherry MX switches, RGB backlighting, and PBT keycaps.', 140, 130, 7, '/image/25', 'Ducky Shine 7 offers a unique typing experience with its RGB backlighting, customizable keys, and high-quality Cherry MX switches. Built for both gaming and typing, it combines style and functionality.', 1, 8, 18, 2),
('KeyChron K3', 'Wireless mechanical keyboard with slim profile, Gateron switches, and RGB backlighting.', 100, 90, 5, '/image/26', 'KeyChron K3 is a thin and light wireless mechanical keyboard with hot-swappable keys, ideal for users who prefer portability and comfort without sacrificing performance and connectivity.', 4, 1, 0, 1),
('Razer Cynosa V2', 'Membrane keyboard with RGB backlighting, dedicated media controls, and programmable keys.', 60, 50, 3, '/image/27', 'Razer Cynosa V2 offers a membrane-based typing experience with a soft-touch finish, featuring customizable RGB Chroma backlighting and dedicated media controls, designed for gamers on a budget.', 1, 4, 30, 1),
('Corsair K63', 'Wireless mechanical keyboard with Cherry MX switches, RGB backlighting, and a compact design.', 120, 110, 6, '/image/28', 'Corsair K63 is a wireless mechanical keyboard with a compact layout and Cherry MX switches, delivering high performance and exceptional battery life, perfect for gaming and productivity on the go.', 3, 3, 34, 1),
('SteelSeries Apex 5', 'Hybrid mechanical keyboard with SteelSeries QX2 switches, RGB backlighting, and an aluminum frame.', 110, 100, 4, '/image/29', 'The SteelSeries Apex 5 features hybrid switches for tactile feedback and fast response times, along with customizable RGB backlighting and an aluminum frame, offering a perfect balance of performance and durability for gamers.', 4, 5, 24, 1),
('Anne Pro 1', '60% mechanical keyboard with Bluetooth, RGB backlighting, and Gateron switches.', 90, 80, 5, '/image/30', 'Anne Pro 1 is a 60% wireless mechanical keyboard with RGB backlighting, perfect for minimalists and gamers looking for portability without compromising performance or key customization.', 4, 7, 0, 2),

('Asus TUF K1', 'Membrane gaming keyboard with customizable lighting, durable design, and programmable keys.', 70, 60, 3, '/image/31', 'Asus TUF K1 is a durable, high-performance gaming keyboard designed to handle long hours of gaming. With a membrane switch design and customizable RGB lighting, this keyboard ensures comfort and responsiveness. Its rugged build, anti-ghosting feature, and dedicated media controls make it a reliable option for both casual and professional gamers.', 1, 9, 15, 1),
('HyperX Alloy Core', 'Membrane keyboard with RGB backlighting, media controls, and a durable design.', 50, 45, 4, '/image/32', 'The HyperX Alloy Core is a budget-friendly yet durable membrane keyboard with bright RGB backlighting. Designed for gamers who need a responsive typing experience, it features quiet, soft-touch keys and an impact-resistant frame. The Alloy Core is perfect for those who want a functional gaming keyboard without the high price tag.', 2, 6, 16, 1),
('KeyChron K10', 'Full-size mechanical keyboard with Bluetooth and wired options, Gateron switches, and RGB backlighting.', 110, 100, 6, '/image/33', 'KeyChron K10 is a full-size wireless mechanical keyboard with a traditional layout. It offers wireless Bluetooth connectivity for multiple devices and comes with hot-swappable keys to change switches according to your preferences. With its sleek aluminum frame and customizable RGB backlighting, the K10 is ideal for work, gaming, and everything in between.', 3, 1, 0, 1),
('Razer DeathStalker V2', 'Low-profile mechanical keyboard with Razer Optical switches, RGB lighting, and a slim design.', 220, 210, 7, '/image/34', 'Razer DeathStalker V2 is a slim and ultra-lightweight wireless keyboard designed for gaming enthusiasts who prefer a low-profile typing experience. It features optical key switches that deliver faster actuation, and the customizable RGB backlighting ensures your keyboard stands out. The ergonomic design and wireless connectivity offer ultimate flexibility and comfort during intense gaming sessions.', 3, 4, 7, 1),
('Ducky One 3', 'Full-size mechanical keyboard with Cherry MX switches, RGB backlighting, and PBT keycaps.', 160, 150, 5, '/image/35', 'Ducky One 3 is a highly customizable mechanical keyboard offering superior build quality and a wide range of switch options. With customizable layouts and vibrant RGB lighting, it is ideal for both gamers and typists looking for precision, comfort, and style. It also features high-quality PBT keycaps for durability and an enhanced typing experience.', 1, 8, 9, 2),
('Corsair K100 RGB', 'High-end mechanical keyboard with Cherry MX switches, RGB backlighting, and dedicated macro keys.', 230, 220, 6, '/image/36', 'Corsair K100 RGB is a top-tier mechanical keyboard featuring programmable macro keys, Cherry MX switches, and per-key RGB lighting. Perfect for serious gamers, the K100 provides excellent tactile feedback, fast actuation, and durability. With dedicated media controls and advanced customization options, this keyboard is built for performance and longevity in the most demanding gaming environments.', 4, 3, 0, 1),
('Logitech Ergo K860', 'Ergonomic wireless keyboard with split key design, quiet keys, and a curved shape.', 130, 120, 7, '/image/37', 'Logitech Ergo K860 is an ergonomic wireless keyboard designed for ultimate comfort during long typing sessions. The split keyboard design, curved layout, and cushioned palm rest reduce strain on your wrists and forearms. With wireless Bluetooth connectivity and programmable keys, it offers an efficient, comfortable typing experience for both work and leisure, minimizing discomfort and improving productivity.', 2, 2, 14, 1),
('Redragon K530', 'Compact wireless mechanical keyboard with Redragon switches, RGB backlighting, and a budget-friendly price.', 70, 65, 4, '/image/38', 'Redragon K530 is a compact wireless mechanical keyboard that combines portability with performance. The 60% layout saves space on your desk while maintaining the essential features needed for gaming. It includes RGB lighting, hot-swappable switches, and Bluetooth connectivity, making it an ideal choice for users who want a functional yet compact keyboard for both gaming and productivity.', 3, 10, 20, 1),
('Roccat Pyro', 'Mechanical keyboard with linear switches, RGB lighting, and an ergonomic design.', 100, 90, 5, '/image/39', 'Roccat Pyro is a budget-friendly gaming keyboard that uses linear mechanical switches for smooth and fast keystrokes. With its RGB backlighting, durable build, and anti-ghosting technology, the Pyro delivers responsive and precise performance. Its affordable price point makes it an excellent choice for gamers who want to upgrade their setup without breaking the bank.', 1, 9, 24, 1),
('KeyChron K4', 'Compact mechanical keyboard with Bluetooth and wired connectivity, Gateron switches, and RGB backlighting.', 120, 110, 6, '/image/40', 'KeyChron K4 is a wireless mechanical keyboard with a compact layout and RGB backlighting. Offering Bluetooth connectivity and hot-swappable keys, it is perfect for those who value flexibility and portability. With its sturdy aluminum frame and long battery life, the K4 is ideal for both work and gaming, offering a balance of performance and style for any user.', 1, 1, 19, 2),

('SteelSeries Apex 3', 'Budget-friendly membrane keyboard with RGB backlighting and an IP32 water-resistant design.', 60, 55, 3, '/image/41', 
	'SteelSeries Apex 3 is an affordable and water-resistant keyboard designed for gamers who need reliability without the high price tag. It features a membrane switch system that offers smooth keystrokes, while its IP32 water-resistant rating protects against spills. The keyboard also includes customizable RGB lighting, making it both functional and stylish for gaming or work environments.', 
	1, 5, 0, 1),
('HyperX Alloy Elite 2', 'Mechanical keyboard with HyperX switches, RGB backlighting, and dedicated media controls.', 150, 140, 7, '/image/42', 
	'HyperX Alloy Elite 2 is a stylish and durable mechanical keyboard with pudding keycaps that allow vibrant RGB lighting to shine through. Built with a sturdy steel frame, it delivers a premium gaming experience with responsive keys and customizable macros. The Alloy Elite 2 also includes dedicated media controls, providing convenience during intense gaming sessions or productivity tasks.', 
	1, 6, 22, 1),
('Corsair K60 RGB Pro', 'Mechanical keyboard with Cherry MX switches, RGB backlighting, and a slim, compact design.', 130, 120, 4, '/image/43', 
	'Corsair K60 RGB Pro is a compact and sleek gaming keyboard with low-profile Cherry MX keys. Its slim design offers a modern, ergonomic feel, while the dynamic RGB backlighting enhances the gaming atmosphere. The keyboard includes a durable aluminum frame and customizable key switches, making it an ideal choice for gamers who value both style and performance.', 
	4, 3, 26, 1),
('Asus ROG Falchion', 'Wireless mechanical keyboard with a compact design, RGB backlighting, and a detachable USB-C cable.', 160, 150, 5, '/image/44', 
	'Asus ROG Falchion is a wireless compact gaming keyboard that packs performance into a small form factor. Equipped with hot-swappable mechanical key switches and customizable RGB lighting, the keyboard provides a highly responsive typing experience. Its compact design, coupled with the ROG Armory Crate software, allows for deep customization of key functions and lighting effects, making it perfect for competitive gamers.', 
	1, 9, 6, 1),
('Razer Pro Type Ultra', 'WSilent mechanical keyboard with Razer Orange switches, white backlighting, and a professional design.', 150, 140, 6, '/image/45',
	'Razer Pro Type Ultra is an elegant wireless keyboard designed for professionals who need a quiet and efficient typing experience. Featuring Razer’s silent mechanical switches, the keyboard offers a smooth, responsive feel without the noise. Its sleek design, with a durable matte finish and wireless connectivity, makes it ideal for productivity and office work, providing a perfect blend of comfort and performance.', 
	2, 4, 8, 2),
('Ducky Mecha Mini', '60% mechanical keyboard with Cherry MX switches, RGB backlighting, and a metal frame.', 110, 100, 5, '/image/46', 
	'Ducky Mecha Mini is a compact and durable mechanical keyboard that delivers high performance in a small package. With its customizable RGB lighting and premium mechanical switches, this keyboard is built to last. Its 60% layout makes it ideal for users looking for portability and desk space efficiency without sacrificing key functionality. The Mecha Mini also features a solid aluminum body for added durability.', 
	1, 8, 0, 1),
('Redragon K587', 'Compact mechanical keyboard with Redragon switches, RGB backlighting, and a budget-friendly price.', 50, 45, 3, '/image/47', 
	'Redragon K587 is a budget gaming keyboard that offers excellent value for money. Despite its affordable price, it comes with RGB backlighting and durable mechanical switches that provide a satisfying typing experience. The keyboard’s compact design makes it easy to transport, while its anti-ghosting and ergonomic layout make it a reliable choice for gaming enthusiasts.', 
	1, 10, 19, 1),
('Razer Tartarus Pro', 'Mechanical keypad with Razer Analog Optical switches, RGB backlighting, and customizable keys.', 130, 120, 4, '/image/48', 
	'Razer Tartarus Pro is an advanced gaming keypad designed for gamers who need precise control and customization. Featuring an ergonomic layout with 32 programmable keys, it offers rapid access to game commands and macros. The keypad includes Razer’s analog optical switches for a smoother, more responsive feel and customizable RGB lighting for a personalized gaming experience.', 
	1, 4, 30, 1),
('KeyChron V1', 'Wireless mechanical keyboard with RGB backlighting, Gateron switches, and a compact design.', 110, 100, 5, '/image/49', 
	'KeyChron V1 is a compact wireless keyboard that offers a modern design and a satisfying typing experience. With customizable RGB backlighting and a choice of mechanical switches, it is suitable for both work and gaming environments. The V1 features wireless Bluetooth connectivity, making it an excellent option for those who need flexibility and portability in a compact form factor.', 
	1, 1, 4, 1),
('Logitech Craft', 'Creative keyboard with wireless connectivity, input dial, and multi-device compatibility for professionals.', 200, 190, 6, '/image/50', 
	'Logitech Craft is a premium wireless keyboard designed for creative professionals. It features an innovative input dial that allows users to adjust settings with precision in software like Adobe Photoshop or Lightroom. The keyboard provides a tactile typing experience with comfortable, low-profile keys and quiet key presses, making it ideal for long hours of creative work. The Craft is built for efficiency and is compatible with both Windows and MacOS devices.', 
	2, 2, 17, 2);

-- Insert values into Review
INSERT INTO Review (ProductID, Email, ReviewDate, Comment, Stars) VALUES
(1, 'user1@example.com', '2024-11-01', 'Great compact keyboard!', 5),
(2, 'user2@example.com', '2024-11-02', 'Feels amazing to type on!', 4),
(3, 'user3@example.com', '2024-11-03', 'Solid build, but pricey.', 4),
(4, 'user4@example.com', '2024-11-04', 'Perfect size for my desk.', 5),
(5, 'user5@example.com', '2024-11-05', 'The best keyboard ever used.', 5),
(6, 'user6@example.com', '2024-11-06', 'Great for gaming.', 5),
(7, 'user7@example.com', '2024-11-07', 'Elegant and reliable.', 5),
(8, 'user8@example.com', '2024-11-08', 'Affordable yet powerful.', 4),
(9, 'user9@example.com', '2024-11-09', 'Fantastic customization options.', 5),
(10, 'user10@example.com', '2024-11-10', 'Switches are excellent!', 5);


-- Insert values into AccountType
INSERT INTO AccountType (Email, PasswordOrGoogleID, Type) VALUES
('user1@example.com', 'password1', 'Email'),
('user2@example.com', 'password2', 'Email'),
('user3@example.com', 'password3', 'Email'),
('user4@example.com', 'password4', 'Google'),
('user5@example.com', 'googleid5', 'Google'),
('user6@example.com', 'password6', 'Email'),
('user7@example.com', 'googleid7', 'Google'),
('user8@example.com', 'password8', 'Email'),
('user9@example.com', 'password9', 'Google'),
('user10@example.com', 'password10', 'Email');


-- Insert values into Users
INSERT INTO Users (Username, Email, Phone) VALUES
('Alice', 'user1@example.com', '0123456789'),
('Bob', 'user2@example.com', '0987654321'),
('Charlie', 'user3@example.com', '0234567891'),
('David', 'user4@example.com', '0345678912'),
('Eve', 'user5@example.com', '0456789123'),
('Fiona', 'user6@example.com', '0567891234'),
('George', 'user7@example.com', '0678912345'),
('Hannah', 'user8@example.com', '0789123456'),
('Ian', 'user9@example.com', '0891234567'),
('Jack', 'user10@example.com', '0901234567');


-- Insert values into Address
INSERT INTO Address (UserID, Province, District, Ward, Street) VALUES
(1, 'Hanoi', 'Cau Giay', 'Dich Vong', '123 Street A'),
(2, 'Hanoi', 'Thanh Xuan', 'Khuong Dinh', '234 Street B'),
(3, 'Ho Chi Minh City', 'District 1', 'Ben Nghe', '345 Street C'),
(4, 'Da Nang', 'Hai Chau', 'Thach Thang', '456 Street D'),
(5, 'Hai Phong', 'Ngo Quyen', 'Dong Khe', '567 Street E'),
(6, 'Can Tho', 'Ninh Kieu', 'An Hoa', '678 Street F'),
(7, 'Hue', 'Phu Nhuan', 'Phu Hoi', '789 Street G'),
(8, 'Vung Tau', 'Ba Ria', 'Phuoc Hai', '890 Street H'),
(9, 'Quy Nhon', 'Tuy Phuoc', 'Dien Duong', '901 Street I'),
(10, 'Nha Trang', 'Vinh Hai', 'Vinh Phuoc', '1234 Street J');


-- Insert values into Orders
INSERT INTO Orders (UserID, UserPaid, TotalAmount, OrderDate, OrderStatus, PaymentMethod)
VALUES
-- January
(1, 250, 270, '2024-12-15', 'Approved', 'Money Transfer'),
(2, 300, 330, '2024-12-20', 'Shipped', 'Pay In Cash'),
-- February
(3, 200, 220, '2024-12-10', 'Completed', 'Money Transfer'),
(4, 400, 450, '2024-12-18', 'Pending Approval', 'Pay In Cash'),
-- March
(5, 300, 320, '2024-12-05', 'Refuse', 'Money Transfer'),
(1, 150, 180, '2024-12-25', 'Approved', 'Pay In Cash'),
-- April
(2, 500, 550, '2024-12-01', 'Completed', 'Money Transfer'),
(3, 350, 400, '2024-12-15', 'Pending Approval', 'Pay In Cash'),
-- May
(4, 180, 200, '2024-12-10', 'Shipped', 'Money Transfer'),
(5, 240, 260, '2024-12-25', 'Completed', 'Pay In Cash'),
-- June
(1, 300, 320, '2024-12-05', 'Approved', 'Money Transfer'),
(2, 200, 230, '2024-12-18', 'Shipped', 'Pay In Cash'),
-- July
(3, 400, 450, '2024-12-12', 'Pending Approval', 'Money Transfer'),
(4, 320, 350, '2024-12-27', 'Completed', 'Pay In Cash'),
-- August
(5, 600, 650, '2024-12-10', 'Refuse', 'Money Transfer'),
(1, 150, 180, '2024-12-20', 'Shipped', 'Pay In Cash'),
-- September
(2, 500, 520, '2024-12-05', 'Completed', 'Money Transfer'),
(3, 220, 250, '2024-12-15', 'Pending Approval', 'Pay In Cash'),
-- October
(4, 350, 380, '2024-12-10', 'Shipped', 'Money Transfer'),
(5, 450, 480, '2024-12-20', 'Completed', 'Pay In Cash'),
-- November
(1, 270, 300, '2024-12-01', 'Approved', 'Money Transfer'),
(2, 310, 330, '2024-12-15', 'Shipped', 'Pay In Cash'),
-- December
(3, 500, 520, '2024-12-05', 'Pending Approval', 'Money Transfer'),
(4, 150, 180, '2024-12-20', 'Completed', 'Pay In Cash');



INSERT INTO GroupByProduct (StartDate, EndDate, EstimateArrive, GroupByPrice, MinPariticipants, CurrentParticipants, ProductID)
VALUES
-- Group Buy for ProductID 1
('2024-11-01', '2024-11-15', '2024-11-20', 120, 50, 30, 1),   -- Group buy for KeyChron K2
-- Group Buy for ProductID 5
('2024-11-10', '2024-11-24', '2024-11-24', 100, 70, 55, 5),    -- Group buy for SteelSeries Apex Pro
-- Group Buy for ProductID 10
('2024-11-20', '2024-12-04', '2024-12-10', 125, 35, 25, 10),   -- Group buy for Ducky One 2 Mini
-- Group Buy for ProductID 15
('2024-11-28', '2024-12-12', '2024-12-20', 75, 25, 20, 15),    -- Group buy for Logitech K780
-- Group Buy for ProductID 20
('2024-12-06', '2024-12-20', '2024-12-28', 120, 45, 35, 20),   -- Group buy for KeyChron Q2
-- Group Buy for ProductID 25
('2024-12-14', '2024-12-28', '2024-12-28', 190, 60, 50, 25),   -- Group buy for Ducky Shine 7
-- Group Buy for ProductID 30
('2024-12-22', '2025-01-05', '2024-12-28', 240, 80, 70, 30),   -- Group buy for Anne Pro 1
-- Group Buy for ProductID 35
('2024-12-25', '2025-01-08', '2025-01-10', 130, 40, 30, 35),   -- Group buy for Ducky One 3
-- Group Buy for ProductID 40
('2024-12-26', '2025-01-09', '2025-01-10', 180, 55, 45, 40),   -- Group buy for KeyChron K4
-- Group Buy for ProductID 45
('2024-12-28', '2025-01-12', '2025-01-15', 160, 60, 50, 45),   -- Group buy for Razer Pro Type Ultra
-- Group Buy for ProductID 50
('2024-12-12', '2025-01-15', '2025-01-20', 100, 60, 50, 50);   -- Group buy for Razer Pro Type Ultra



INSERT INTO OrderDetail (OrderID, NumericalOrder, ProductID, Quantity, GroupByID)
VALUES
-- January
(1, 1, 1, 1, NULL),  -- Standard keyboard
(1, 2, 2, 1, NULL),  -- RGB Mechanical Keyboard
(2, 1, 3, 2, NULL),  -- Budget keyboard
-- February
(3, 1, NULL, 1, 1),  -- Group buy for keycaps
(3, 2, 5, 3, NULL),  -- Keycap kit
(4, 1, 7, 1, NULL),  -- Compact keyboard
-- March
(5, 1, NULL, 1, 2),  -- Group buy for switches
(5, 2, 6, 5, NULL),  -- Switch set
(6, 1, 8, 1, NULL),  -- DIY Kit
-- April
(7, 1, 9, 1, NULL),  -- Artisan keycaps
(7, 2, NULL, 1, 3),  -- Group buy for aluminum cases
(8, 1, 6, 2, NULL),  -- Switch set
(8, 2, 10, 1, NULL), -- Lubricant kit
-- May
(9, 1, 7, 1, NULL),  -- Compact keyboard
(9, 2, NULL, 1, 4),  -- Group buy for PCB kits
(10, 1, 8, 2, NULL),  -- DIY Mechanical Kit
(10, 2, 5, 4, NULL),  -- Keycap kit
-- June
(11, 1, 1, 1, NULL),  -- Standard keyboard
(11, 2, 2, 1, NULL),  -- RGB Mechanical Keyboard
(12, 1, 3, 1, NULL),  -- Budget 60% keyboard
(12, 2, NULL, 1, 5),  -- Group buy for wireless keyboards
-- July
(13, 1, 5, 3, NULL),  -- Keycap kit
(13, 2, 6, 6, NULL),  -- Switch set
(14, 1, NULL, 1, 6),  -- Group buy for cases
(14, 2, 8, 1, NULL),  -- DIY Mechanical Kit
-- August
(15, 1, 7, 1, NULL),  -- Compact keyboard
(15, 2, NULL, 2, 7),  -- Group buy for aluminum cases
(16, 1, 9, 1, NULL),  -- Artisan keycaps
(16, 2, 10, 1, NULL), -- Lubricant kit
-- September
(17, 1, 1, 2, NULL),  -- Standard keyboard
(17, 2, NULL, 1, 8),  -- Group buy for RGB Mechanical Keyboards
(18, 1, 6, 4, NULL),  -- Switch set
(18, 2, 5, 2, NULL),  -- Keycap kit
-- October
(19, 1, 8, 1, NULL),  -- DIY Mechanical Kit
(19, 2, NULL, 1, 9),  -- Group buy for compact keyboards
(20, 1, 2, 2, NULL),  -- RGB Mechanical Keyboard
(20, 2, 7, 1, NULL),  -- Compact keyboard
-- November
(21, 1, NULL, 1, 10), -- Group buy for keycap kits
(21, 2, 5, 3, NULL),  -- Keycap kit
(22, 1, 3, 1, NULL),  -- Budget 60% keyboard
(22, 2, 9, 1, NULL),  -- Artisan keycaps
-- December
(23, 1, 6, 5, NULL),  -- Switch set
(23, 2, 10, 1, NULL), -- Lubricant kit
(24, 1, NULL, 1, 11), -- Group buy for artisan cases
(24, 2, 7, 2, NULL);  -- Compact keyboard


INSERT INTO EmailForReceivingInfo (Email)
VALUES ('123@example.com'),
	('1234@example.com'),
	('1245@example.com'),
	('12456@example.com');