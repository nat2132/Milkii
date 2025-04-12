import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Dimensions, // Import Dimensions for modal sizing
  Modal, // Import standard Modal
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import ColorPicker from 'react-native-wheel-color-picker'; // Import the new picker
import { InventoryItem } from "../stores/useInventoryStore"; // Import the store type

// --- Define Missing Interfaces ---
export interface ColorEntry {
  id: string;
  name: string;
  quantity: string; // Keep as string from input
  code: string; // Hex code
}

export interface SpecificationEntry {
  id: string;
  title: string;
  description: string;
}

// Interface for the form's internal state
export interface ItemData {
  itemName: string;
  itemCategory: string;
  totalQuantity: string;
  totalQuantityUnit: string;
  itemPerPack: string;
  itemPerPackUnit: string;
  companyName: string;
  sellingQuantity: string;
  sellingUnit: string;
  howMuchInOneBox: string;
  howMuchInOneBoxUnit: string;
  purchasedPrice: string;
  sellingPrice: string;
  quality: string | undefined;
  description: string;
  imageUris: string[];
  mainImageIndex: number;
}

// Interface for the component props
export interface AddNewItemFormProps {
  onSubmit: (item: Partial<InventoryItem>) => void;
  onCancel: () => void;
  initialValues?: Partial<InventoryItem>;
  formTitle?: string;
}

// --- Define Missing Constants ---
const units = [
  { label: "Piece", value: "piece" },
  { label: "Pack", value: "pack" },
  { label: "Box", value: "box" },
  { label: "Kg", value: "kg" },
  { label: "Liter", value: "liter" },
  { label: "Can", value: "can" },
  { label: "Jug", value: "jug" },
  { label: "Gallon", value: "gallon" },
  // Add other relevant units
];

const qualityOptions = [
  { label: "Select Quality", value: undefined },
  { label: "Grade A", value: "grade a" },
  { label: "Grade B", value: "grade b" },
  { label: "Grade C", value: "grade c" },
];

const AddNewItemForm: React.FC<AddNewItemFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  formTitle = "Add New Item",
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<ItemData>(() => {
    if (!initialValues) {
      return {
        itemName: "",
        itemCategory: "",
        totalQuantity: "0",
        totalQuantityUnit: units[0].value,
        itemPerPack: "0",
        itemPerPackUnit: units[0].value,
        companyName: "",
        sellingQuantity: "0",
        sellingUnit: units[0].value,
        howMuchInOneBox: "0",
        howMuchInOneBoxUnit: units[0].value,
        purchasedPrice: "0.00",
        sellingPrice: "0.00",
        quality: undefined,
        description: "",
        imageUris: [],
        mainImageIndex: 0,
      };
    }
    return {
      itemName: initialValues.itemName ?? "",
      itemCategory: initialValues.itemCategory ?? "",
      totalQuantity: initialValues.quantity !== undefined ? initialValues.quantity.toString() : "0",
      totalQuantityUnit: initialValues.unit ?? units[0].value,
      itemPerPack: initialValues.itemPerPack !== undefined ? initialValues.itemPerPack.toString() : "0", // Map from store if exists
      itemPerPackUnit: initialValues.itemPerPackUnit ?? units[0].value, // Map from store if exists
      companyName: initialValues.companyName ?? "",
      sellingQuantity: initialValues.sellingQuantity !== undefined ? initialValues.sellingQuantity.toString() : "0", // Map from store if exists
      sellingUnit: initialValues.sellingUnit ?? units[0].value, // Map from store if exists
      howMuchInOneBox: initialValues.howMuchInOneBox !== undefined ? initialValues.howMuchInOneBox.toString() : "0", // Map from store if exists
      howMuchInOneBoxUnit: initialValues.howMuchInOneBoxUnit ?? units[0].value, // Map from store if exists
      purchasedPrice: initialValues.purchasedPrice !== undefined ? initialValues.purchasedPrice.toString() : "0.00",
      sellingPrice: initialValues.sellingPrice !== undefined ? initialValues.sellingPrice.toString() : "0.00",
      quality: initialValues.quality,
      description: initialValues.description ?? "",
      imageUris: initialValues.imageUri ? [initialValues.imageUri] : (initialValues.imageUris || []),
      mainImageIndex: 0,
    };
  });

  // == Color Management State ==
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColorName, setCurrentColorName] = useState("");
  const [currentColorQuantity, setCurrentColorQuantity] = useState("");
  const [selectedColorHex, setSelectedColorHex] = useState("#4CAF50"); // Default green hex
  const [colorsList, setColorsList] = useState<ColorEntry[]>(
     initialValues?.colors?.map((c, index) => ({ // Initialize from initialValues
        id: `color-${index}-${Date.now()}`,
        name: c.name,
        quantity: c.quantity.toString(),
        code: c.code,
    })) || []
  );
  const [editingColorId, setEditingColorId] = useState<string | null>(null);

  // == Specification Management State ==
  const [currentSpecTitle, setCurrentSpecTitle] = useState("");
  const [currentSpecDescription, setCurrentSpecDescription] = useState("");
  const [specificationsList, setSpecificationsList] = useState<
    SpecificationEntry[]
  >(
    initialValues?.specificationsList?.map((s, index) => ({ // Initialize from initialValues
        id: `spec-${index}-${Date.now()}`,
        title: s.title,
        description: s.description,
    })) || []
  );
  const [editingSpecId, setEditingSpecId] = useState<string | null>(null);

  // == Input Handlers ==
  const handleInputChange = (
    field: keyof ItemData | "currentColorQuantity",
    value: string
  ) => {
    let processedValue = value;
    const integerFields = [
      "totalQuantity",
      "itemPerPack",
      "sellingQuantity",
      "howMuchInOneBox",
      "currentColorQuantity",
    ];
    const decimalFields = ["purchasedPrice", "sellingPrice"];

    if ([...integerFields, ...decimalFields].includes(field as string)) {
      if (value === "") {
        processedValue = ""; // Allow clearing
      } else if (
        integerFields.includes(field as string) &&
        /^\d*$/.test(value)
      ) {
        processedValue = value;
      } else if (
        decimalFields.includes(field as string) &&
        /^\d*\.?\d*$/.test(value)
      ) {
        processedValue = value;
      } else {
        return; // Prevent invalid input
      }
    }

    if (field === "currentColorQuantity") {
      setCurrentColorQuantity(processedValue);
    } else {
      setFormData((prev) => ({ ...prev, [field]: processedValue as any }));
    }
  };

  const handlePickerChange = (
    field:
      | keyof ItemData
      | "sellingUnit"
      | "totalQuantityUnit"
      | "itemPerPackUnit"
      | "quality",
    value: string | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // == Image Picker ==
  const pickImage = async () => {
    // Check if we already have 5 images
    if (formData.imageUris.length >= 5) {
      Alert.alert("Maximum Images", "You can only add up to 5 images per product.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData((prev) => {
        const newImageUris = [...prev.imageUris, result.assets[0].uri];
        // If this is the first image, set it as main image
        const mainImageIndex = prev.imageUris.length === 0 ? 0 : prev.mainImageIndex;
        return { ...prev, imageUris: newImageUris, mainImageIndex };
      });
    }
  };

  // Remove an image at a specific index
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImageUris = [...prev.imageUris];
      newImageUris.splice(index, 1);
      
      // Adjust mainImageIndex if needed
      let newMainImageIndex = prev.mainImageIndex;
      if (newImageUris.length === 0) {
        newMainImageIndex = 0;
      } else if (index === prev.mainImageIndex) {
        // If we removed the main image, set the first image as main
        newMainImageIndex = 0;
      } else if (index < prev.mainImageIndex) {
        // If we removed an image before the main image, adjust the index
        newMainImageIndex--;
      }
      
      return { ...prev, imageUris: newImageUris, mainImageIndex: newMainImageIndex };
    });
  };

  // Set an image as the main image
  const setAsMainImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mainImageIndex: index
    }));
  };

  // == Color Logic ==
  const openColorPicker = () => setColorPickerVisible(true);
  const closeColorPicker = () => setColorPickerVisible(false);
  const onColorChangeComplete = (color: string) => {
    setSelectedColorHex(color);
  };

  const handleAddOrUpdateColor = () => {
    if (
      !currentColorName.trim() ||
      !currentColorQuantity.trim() ||
      Number(currentColorQuantity) <= 0
    ) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid color name and quantity (> 0)."
      );
      return;
    }

    if (editingColorId) {
      setColorsList((prev) =>
        prev.map((c) =>
          c.id === editingColorId
            ? {
                ...c,
                name: currentColorName,
                quantity: currentColorQuantity,
                code: selectedColorHex,
              }
            : c
        )
      );
      setEditingColorId(null);
    } else {
      const newColor: ColorEntry = {
        id: Date.now().toString(),
        name: currentColorName,
        quantity: currentColorQuantity,
        code: selectedColorHex,
      };
      setColorsList((prev) => [...prev, newColor]);
    }
    setCurrentColorName("");
    setCurrentColorQuantity("");
    setSelectedColorHex("#4CAF50");
  };

  const handleEditColor = (color: ColorEntry) => {
    setEditingColorId(color.id);
    setCurrentColorName(color.name);
    setCurrentColorQuantity(color.quantity);
    setSelectedColorHex(color.code);
  };

  const handleDeleteColor = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this color entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setColorsList((prev) => prev.filter((c) => c.id !== id));
            if (editingColorId === id) {
              setEditingColorId(null);
              setCurrentColorName("");
              setCurrentColorQuantity("");
              setSelectedColorHex("#4CAF50");
            }
          },
        },
      ]
    );
  };

  // == Specification Logic ==
  const handleAddOrUpdateSpecification = () => {
    if (!currentSpecTitle.trim()) {
      Alert.alert(
        "Invalid Input",
        "Please enter a title for the specification."
      );
      return;
    }
    if (editingSpecId) {
      setSpecificationsList((prev) =>
        prev.map((s) =>
          s.id === editingSpecId
            ? {
                ...s,
                title: currentSpecTitle,
                description: currentSpecDescription,
              }
            : s
        )
      );
      setEditingSpecId(null);
    } else {
      const newSpec: SpecificationEntry = {
        id: Date.now().toString(),
        title: currentSpecTitle,
        description: currentSpecDescription,
      };
      setSpecificationsList((prev) => [...prev, newSpec]);
    }
    setCurrentSpecTitle("");
    setCurrentSpecDescription("");
  };
  const handleEditSpecification = (spec: SpecificationEntry) => {
    setEditingSpecId(spec.id);
    setCurrentSpecTitle(spec.title);
    setCurrentSpecDescription(spec.description);
  };
  const handleDeleteSpecification = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this specification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSpecificationsList((prev) => prev.filter((s) => s.id !== id));
            if (editingSpecId === id) {
              setEditingSpecId(null);
              setCurrentSpecTitle("");
              setCurrentSpecDescription("");
            }
          },
        },
      ]
    );
  };

  // == Conditional Rendering Logic ==
  const showItemPerPack = useMemo(
    () => formData.totalQuantityUnit === "pack",
    [formData.totalQuantityUnit]
  );
  const showHowMuchInOneBox = useMemo(() => {
    const condition1 =
      formData.totalQuantityUnit === "box" && formData.sellingUnit !== "box";
    const condition2 = showItemPerPack && formData.itemPerPackUnit === "box";
    return condition1 || condition2;
  }, [
    formData.totalQuantityUnit,
    formData.sellingUnit,
    formData.itemPerPackUnit,
    showItemPerPack,
  ]);

  // == Dynamic Labels ==
  const priceLabelSuffix = useMemo(() => {
    const quantity = formData.sellingQuantity && Number(formData.sellingQuantity) > 0 
      ? formData.sellingQuantity 
      : "1";
    return formData.sellingUnit 
      ? `per ${quantity} ${formData.sellingUnit}` 
      : "per unit";
  }, [formData.sellingUnit, formData.sellingQuantity]);

  // == Form Submission ==
  const handleSubmit = () => {
    if (!formData.itemName.trim()) {
      Alert.alert("Missing Information", "Please enter the Item Name.");
      return;
    }
    if (Number(formData.totalQuantity) <= 0) {
      Alert.alert("Invalid Quantity", "Total Quantity must be greater than 0.");
      return;
    }

    const preparedItemData: Partial<InventoryItem> = {
      itemName: formData.itemName,
      itemCategory: formData.itemCategory,
      quantity: Number(formData.totalQuantity) || 0,
      unit: formData.totalQuantityUnit,
      itemPerPack: showItemPerPack ? Number(formData.itemPerPack) || 0 : undefined,
      itemPerPackUnit: showItemPerPack ? formData.itemPerPackUnit : undefined,
      companyName: formData.companyName,
      sellingQuantity: Number(formData.sellingQuantity) || 0, // Keep as provided in form
      sellingUnit: formData.sellingUnit, // Keep as provided in form
      howMuchInOneBox: showHowMuchInOneBox ? Number(formData.howMuchInOneBox) || 0 : undefined,
      howMuchInOneBoxUnit: showHowMuchInOneBox ? formData.howMuchInOneBoxUnit : undefined,
      purchasedPrice: Number(formData.purchasedPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      quality: formData.quality,
      description: formData.description,
      imageUri: formData.imageUris[formData.mainImageIndex], // Set main image as the primary imageUri
      imageUris: formData.imageUris, // Store all image URIs
      mainImageIndex: formData.mainImageIndex, // Store which image is the main one
      color: colorsList.length > 0 ? colorsList[0].name : undefined,
      colors: colorsList.map((c) => ({
        name: c.name,
        quantity: Number(c.quantity),
        code: c.code,
      })),
      specifications: specificationsList
        .map((spec) => `${spec.title}${spec.description ? ": " + spec.description : ""}`)
        .join("\n"),
      specificationsList: specificationsList.map((spec) => ({
        title: spec.title,
        description: spec.description,
      })),
    };

    onSubmit(preparedItemData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{formTitle}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onCancel}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Multiple Image Picker */}
        <View style={styles.imagePickerContainer}>
          {/* Main Image Preview */}
          <View style={styles.mainImageContainer}>
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
              {formData.imageUris.length > 0 ? (
                <Image
                  source={{ uri: formData.imageUris[formData.mainImageIndex] }}
                  style={styles.imagePreview}
                />
              ) : (
                <Feather name="image" size={48} color="#BDBDBD" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.addImageText}>
                {formData.imageUris.length > 0
                  ? "Add More Images"
                  : "Add a Product Image"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.imageCountText}>
              {formData.imageUris.length}/5 Images
            </Text>
          </View>

          {/* Image Thumbnails */}
          {formData.imageUris.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailsContainer}
              contentContainerStyle={styles.thumbnailsContent}
            >
              {formData.imageUris.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.thumbnailWrapper}>
                  <TouchableOpacity 
                    style={[styles.thumbnail, index === formData.mainImageIndex && styles.mainThumbnail]}
                    onPress={() => setAsMainImage(index)}
                  >
                    <Image source={{ uri }} style={styles.thumbnailImage} />
                    {index === formData.mainImageIndex && (
                      <View style={styles.mainImageBadge}>
                        <Text style={styles.mainImageText}>Main</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            value={formData.itemName}
            onChangeText={(v) => handleInputChange("itemName", v)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Category"
            value={formData.itemCategory}
            onChangeText={(v) => handleInputChange("itemCategory", v)}
          />
        </View>

        {/* Total Quantity Row */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Total Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={formData.totalQuantity}
              onChangeText={(v) => handleInputChange("totalQuantity", v)}
            />
          </View>
          <View style={[styles.formGroup, styles.rowItem, styles.rowItemLast]}>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.totalQuantityUnit}
                onValueChange={(v) =>
                  handlePickerChange("totalQuantityUnit", v)
                }
                style={styles.picker}
              >
                {units.map((u) => (
                  <Picker.Item key={u.value} label={u.label} value={u.value} />
                ))}
              </Picker>
              <Feather
                name="chevron-down"
                size={20}
                color="#BDBDBD"
                style={styles.pickerArrow}
              />
            </View>
          </View>
        </View>

        {/* Conditional Item Per Pack Row */}
        {showItemPerPack && (
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.rowItem]}>
              <Text style={styles.label}>Item Per Pack</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={formData.itemPerPack}
                onChangeText={(v) => handleInputChange("itemPerPack", v)}
              />
            </View>
            <View
              style={[styles.formGroup, styles.rowItem, styles.rowItemLast]}
            >
              <Text style={styles.label}>Unit</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.itemPerPackUnit}
                  onValueChange={(v) =>
                    handlePickerChange("itemPerPackUnit", v)
                  }
                  style={styles.picker}
                >
                  {units.map((u) => (
                    <Picker.Item
                      key={u.value}
                      label={u.label}
                      value={u.value}
                    />
                  ))}
                </Picker>
                <Feather
                  name="chevron-down"
                  size={20}
                  color="#BDBDBD"
                  style={styles.pickerArrow}
                />
              </View>
            </View>
          </View>
        )}

        {/* Company Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Company Name"
            value={formData.companyName}
            onChangeText={(v) => handleInputChange("companyName", v)}
          />
        </View>

        {/* Color Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Colors</Text>
          <View style={styles.cardListContainer}>
            {colorsList.map((color) => (
              <View key={color.id} style={styles.itemCard}>
                <View style={styles.cardContent}>
                  <View
                    style={[
                      styles.colorPreview,
                      { backgroundColor: color.code },
                    ]}
                  />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{color.name}</Text>
                    <Text style={styles.cardSubtitle}>
                      Quantity: {color.quantity}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleEditColor(color)}
                    style={styles.iconButton}
                  >
                    <Feather name="edit-2" size={18} color="#555" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteColor(color.id)}
                    style={styles.iconButton}
                  >
                    <Feather name="trash-2" size={18} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.colorInputRow}>
            <TouchableOpacity
              onPress={openColorPicker}
              style={[
                styles.colorPreviewTouchable,
                { backgroundColor: selectedColorHex },
              ]}
            />
            <TextInput
              style={[styles.input, styles.colorNameInput]}
              placeholder="Color Name"
              value={currentColorName}
              onChangeText={setCurrentColorName}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Quantity ({currentColorName.trim() || "Selected Color"})
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={currentColorQuantity}
              onChangeText={(v) => handleInputChange("currentColorQuantity", v)}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.buttonBase,
              styles.addToListButton,
              (!currentColorName.trim() || !currentColorQuantity.trim()) &&
                styles.disabledButton,
            ]}
            onPress={handleAddOrUpdateColor}
            disabled={!currentColorName.trim() || !currentColorQuantity.trim()}
          >
            <Text style={styles.addToListButtonText}>
              {editingColorId ? "Update Color" : "+ Add Color"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ------- MODIFIED Selling Quantity Row START ------- */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.rowItem]}>
            <Text style={styles.label}>Selling Quantity</Text>
            <TextInput
              style={styles.input} // Use standard input style
              placeholder="0"
              keyboardType="numeric"
              value={formData.sellingQuantity}
              onChangeText={(v) => handleInputChange("sellingQuantity", v)}
            />
          </View>
          <View style={[styles.formGroup, styles.rowItem, styles.rowItemLast]}>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.sellingUnit}
                onValueChange={(v) => handlePickerChange("sellingUnit", v)}
                style={styles.picker}
              >
                {units.map((u) => (
                  <Picker.Item key={u.value} label={u.label} value={u.value} />
                ))}
              </Picker>
              <Feather
                name="chevron-down"
                size={20}
                color="#BDBDBD"
                style={styles.pickerArrow}
              />
            </View>
          </View>
        </View>
        {/* ------- MODIFIED Selling Quantity Row END ------- */}


        {/* Conditional How Much In One Box */}
        {showHowMuchInOneBox && (
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.rowItem]}>
              <Text style={styles.label}>How Much is in One Box?</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={formData.howMuchInOneBox}
                onChangeText={(v) => handleInputChange("howMuchInOneBox", v)}
              />
            </View>
            <View style={[styles.formGroup, styles.rowItem, styles.rowItemLast]}>
              <Text style={styles.label}>Unit</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.howMuchInOneBoxUnit}
                  onValueChange={(v) => handlePickerChange("howMuchInOneBoxUnit", v)}
                  style={styles.picker}
                >
                  {units.map((u) => (
                    <Picker.Item key={u.value} label={u.label} value={u.value} />
                  ))}
                </Picker>
                <Feather
                  name="chevron-down"
                  size={20}
                  color="#BDBDBD"
                  style={styles.pickerArrow}
                />
              </View>
            </View>
          </View>
        )}

        {/* Prices, Quality, Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Purchase Price ({priceLabelSuffix})</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            value={formData.purchasedPrice}
            onChangeText={(v) => handleInputChange("purchasedPrice", v)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Selling Price ({priceLabelSuffix})</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            value={formData.sellingPrice}
            onChangeText={(v) => handleInputChange("sellingPrice", v)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Quality</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.quality}
              onValueChange={(v) => handlePickerChange("quality", v)}
              style={styles.picker}
            >
              {qualityOptions.map((q) => (
                <Picker.Item
                  key={q.value ?? "q-placeholder"}
                  label={q.label}
                  value={q.value}
                  color={q.value === undefined ? "#BDBDBD" : "#000"}
                />
              ))}
            </Picker>
            <Feather
              name="chevron-down"
              size={20}
              color="#BDBDBD"
              style={styles.pickerArrow}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Add a Description"
            value={formData.description}
            onChangeText={(v) => handleInputChange("description", v)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Specifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.cardListContainer}>
            {specificationsList.map((spec) => (
              <View key={spec.id} style={styles.itemCard}>
                <View style={styles.cardContent}>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{spec.title}</Text>
                    {spec.description.trim() && (
                      <Text style={styles.cardSubtitle}>
                        {spec.description}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleEditSpecification(spec)}
                    style={styles.iconButton}
                  >
                    <Feather name="edit-2" size={18} color="#555" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteSpecification(spec.id)}
                    style={styles.iconButton}
                  >
                    <Feather name="trash-2" size={18} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Specification Title"
              value={currentSpecTitle}
              onChangeText={setCurrentSpecTitle}
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Specification Description (Optional)"
              value={currentSpecDescription}
              onChangeText={setCurrentSpecDescription}
              multiline
              numberOfLines={3}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.buttonBase,
              styles.addToListButton,
              !currentSpecTitle.trim() && styles.disabledButton,
            ]}
            onPress={handleAddOrUpdateSpecification}
            disabled={!currentSpecTitle.trim()}
          >
            <Text style={styles.addToListButtonText}>
              {editingSpecId ? "Update Specification" : "+ Add Specification"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonBase,
            styles.addItemButton,
            (!formData.itemName || !(Number(formData.totalQuantity) > 0)) &&
              styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!formData.itemName || !(Number(formData.totalQuantity) > 0)}
        >
          <Text style={styles.addItemButtonText}>
            {initialValues ? "Update Item" : "Add Item"} {/* Dynamic button text */}
            </Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <Modal
        visible={isColorPickerVisible}
        onRequestClose={closeColorPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.colorPickerModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Color</Text>
              <TouchableOpacity
                onPress={closeColorPicker}
                style={styles.modalDoneButton}
              >
                <Text style={styles.modalDoneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.colorPickerStyle}>
              <ColorPicker
                color={selectedColorHex}
                onColorChangeComplete={onColorChangeComplete}
              />
            </View>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
};

// --- Styles (No changes needed in styles for this layout adjustment) ---
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  // New styles for multiple images
  mainImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  thumbnailsContainer: {
    marginTop: 10,
    maxHeight: 100,
  },
  thumbnailsContent: {
    paddingHorizontal: 10,
  },
  thumbnailWrapper: {
    marginHorizontal: 5,
    position: 'relative',
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  mainThumbnail: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.7)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  mainImageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageCountText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 15, // Adjust top padding for status bar
    paddingBottom: 10,
    // Removed marginBottom: 40 to let content flow naturally
  },
  headerButton: { padding: 6 },
  headerTitle: { fontSize: 20, fontFamily: "Inter-Bold", color: "#000" },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 90 }, // Increased bottom padding
  imagePickerContainer: { alignItems: "center", marginVertical: 20 }, // Reduced vertical margin
  imagePlaceholder: {
    width: 150,
    height: 130,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#BDBDBD",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    marginBottom: 12,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 8 },
  addImageText: { color: "#007AFF", fontSize: 14, fontWeight: "500" },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontFamily: "Inter-Medium", color: "#444", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#000",
    minHeight: 44, // Ensure consistent height
    fontFamily: "Inter-Regular",
  },
  textarea: {
    minHeight: 100, // Slightly reduced default height
    height: "auto",
    textAlignVertical: "top",
    paddingTop: 10,
    fontFamily: "Inter-Regular",
  },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 8 }, // Use gap for spacing
  rowItem: { flex: 1 }, // Removed marginRight
  rowItemLast: { }, // Removed marginRight: 0, handled by gap
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 44, // Match input height
    justifyContent: "center",
    position: "relative",
  },
  picker: {
        // On iOS, picker might need explicit height to align vertically
        // height: Platform.OS === 'ios' ? 44 : undefined, // Only if needed
        width: "100%",
        color: "#000",
  },
    pickerItemStyle: { // Optional: Style individual picker items if needed
        fontSize: 15,
        fontFamily: "Inter-Regular",
  },
  pickerArrow: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -10, // Adjust based on icon size
    zIndex: -1,
    pointerEvents: "none",
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    marginBottom: 15,
    color: "#444",
  },
  colorInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorPreviewTouchable: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  colorNameInput: { flex: 1, fontFamily: "Inter-Regular" },
  addToListButton: {
    backgroundColor: "#007AFF", // Changed to blue to match Add Item button
    borderColor: "#007AFF",
    marginTop: 5,
    height: 40, // Reduced height slightly
    paddingVertical: 0, // Removed vertical padding to rely on height
    justifyContent: 'center', // Center text vertically
    width: "100%", // Take full width
  },
  addToListButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  cardListContainer: { marginBottom: 10, gap: 10 },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 14, fontFamily: "Inter-Medium", color: "#333" },
  cardSubtitle: { fontSize: 12, color: "#666", fontFamily: "Inter-Regular", marginTop: 2 },
  cardActions: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: 5, marginLeft: 8 },
  bottomButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === 'ios' ? 30 : 12, // Add safe area padding at bottom for iOS
    gap: 16,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 0, // Remove padding, rely on height
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderWidth: 1,
  },
  cancelButton: { backgroundColor: "#fff", borderColor: "#ccc" }, // Lighter border
  cancelButtonText: { color: "#333", fontSize: 16, fontWeight: "500" }, // Darker text
  addItemButton: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  addItemButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  disabledButton: { backgroundColor: "#BDBDBD", borderColor: "#BDBDBD", opacity: 0.7 }, // Added opacity

  // --- Styles for Standard RN Modal ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay
  },
  colorPickerModalContent: {
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get("window").height * 0.7,
    shadowColor: "#000", // Add shadow for modal elevation
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 10, // Padding now handled by parent
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter-Medium",
  },
  modalDoneButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  modalDoneButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  colorPickerStyle: {
    height: 300,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
});

export default AddNewItemForm;